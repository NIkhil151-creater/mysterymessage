const GEMINI_API_URL =
	"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SUGGESTION_PROMPT =
	"Generate exactly three short, engaging messages for an anonymous social messaging app. " +
	"Keep them friendly, varied, and open-ended. Return only a JSON array containing three strings.";

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isThreeSuggestions(value: unknown): value is [string, string, string] {
	return (
		Array.isArray(value) &&
		value.length === 3 &&
		value.every(
			(suggestion: unknown) =>
				typeof suggestion === "string" && suggestion.trim().length > 0,
		)
	);
}

export async function GET() {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		console.error("GEMINI_API_KEY is not configured.");
		return Response.json(
			{ success: false, message: "Gemini API is not configured." },
			{ status: 500 },
		);
	}

	try {
		const response = await fetch(GEMINI_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": apiKey,
			},
			body: JSON.stringify({
				contents: [{ parts: [{ text: SUGGESTION_PROMPT }] }],
				generationConfig: {
					responseMimeType: "application/json",
					responseSchema: {
						type: "ARRAY",
						items: { type: "STRING" },
					},
					temperature: 0.9,
				},
			}),
			cache: "no-store",
		});

		if (!response.ok) {
			const details = await response.text();
			console.error("Gemini message suggestion request failed.", {
				status: response.status,
				details: details.slice(0, 1000),
			});
			return Response.json(
				{ success: false, message: "Unable to generate message suggestions." },
				{ status: response.status === 429 ? 429 : 502 },
			);
		}

		const result: unknown = await response.json();
		const candidates =
			isRecord(result) && Array.isArray(result.candidates)
				? result.candidates
				: [];
		const firstCandidate = candidates[0];
		const content =
			isRecord(firstCandidate) && isRecord(firstCandidate.content)
				? firstCandidate.content
				: undefined;
		const parts = content && Array.isArray(content.parts) ? content.parts : [];
		const text =
			parts.length > 0 && isRecord(parts[0]) && typeof parts[0].text === "string"
				? parts[0].text
				: undefined;

		if (!text) {
			console.error("Gemini returned no message suggestion content.");
			return Response.json(
				{ success: false, message: "Unable to generate message suggestions." },
				{ status: 502 },
			);
		}

		const suggestions: unknown = JSON.parse(text);
		if (!isThreeSuggestions(suggestions)) {
			console.error("Gemini returned an invalid message suggestion list.");
			return Response.json(
				{ success: false, message: "Unable to generate message suggestions." },
				{ status: 502 },
			);
		}

		return Response.json({
			success: true,
			message: suggestions.map((suggestion) => suggestion.trim()).join("||"),
		});
	} catch (error) {
		console.error("Error generating message suggestions with Gemini:", error);
		return Response.json(
			{ success: false, message: "Unable to generate message suggestions." },
			{ status: 502 },
		);
	}
}
 