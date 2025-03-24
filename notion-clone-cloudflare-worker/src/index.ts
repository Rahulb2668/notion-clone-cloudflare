import OpenAI from 'openai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

type Bindings = {
	OPENAI_API_KEY: string;
	GEMINI_API_KEY: string;
	AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	'/*',
	cors({
		origin: '*',
		allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'X-Custom-Header', 'Upgrade-Insecure-Requests'],
		exposeHeaders: ['Content-Type', 'X-Kuma-Revision'],
		credentials: true,
		maxAge: 600,
	})
);

app.post('/chattodocumentwithopenai', async (c) => {
	const openAi = new OpenAI({
		apiKey: c.env.OPENAI_API_KEY,
	});

	const { documentData, question } = await c.req.json();

	const chatCompletion = await openAi.chat.completions.create({
		messages: [
			{
				role: 'system',
				content:
					'You are an AI assistant analyzing document content. Your task is to provide precise, accurate answers based on the provided document. Focus on extracting relevant information and answering questions specifically from the document content ' +
					documentData,
			},
			{
				role: 'user',
				content: `My question is: ${question}`,
			},
		],
		model: 'gpt-3.5-turbo',
		temperature: 0.5,
	});

	const message = chatCompletion.choices[0].message.content;
	return c.json({ message: message });
});
app.post('/chattodocument', async (c) => {
	const genAI = new GoogleGenerativeAI(c.env.GEMINI_API_KEY);

	const { documentData, question } = await c.req.json();

	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

	const chat = model.startChat({
		history: [
			{
				role: 'user',
				parts: [
					{
						text:
							'You are an AI assistant analyzing document content. Your task is to provide precise, accurate answers based on the provided document. Focus on extracting relevant information and answering questions specifically from the document content: ' +
							documentData,
					},
				],
			},
			{
				role: 'model',
				parts: [{ text: "I understand. I'll analyze the document content and answer questions based solely on the information provided." }],
			},
		],
	});

	// Send the user's question
	const result = await chat.sendMessage(question);
	const response = result.response;

	// Return the model's response
	return c.json({ message: response.text() });
});

app.post('/translatedocument', async (c) => {
	const { documentData, targetLanguage } = await c.req.json();

	const summaryOfDocument = await c.env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: documentData,
		max_length: 1000,
	});

	const translatedSummary = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
		text: summaryOfDocument.summary,
		target_lang: targetLanguage,
		source_lang: 'english',
	});

	return new Response(JSON.stringify(translatedSummary));
});

export default app;
