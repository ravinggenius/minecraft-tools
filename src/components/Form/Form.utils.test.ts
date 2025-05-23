// @ts-nocheck // TODO: Remove this when a proper test runner and types (e.g., from Jest/Vitest) are available

// Manually extracting the function for testing as it's not exported directly from Form.tsx
// In a real scenario, this would be imported if exported, or Form.tsx might be refactored.
const objectToFormData = (obj: Record<string, any>): FormData => {
	const formData = new FormData();
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key];
			if (value instanceof File) {
				formData.append(key, value, value.name);
			} else if (Array.isArray(value)) {
				value.forEach((item) => {
					if (item instanceof File) {
						formData.append(key, item, item.name);
					} else if (item !== null && item !== undefined) {
						formData.append(key, String(item));
					}
				});
			} else if (value !== null && value !== undefined) {
				formData.append(key, String(value));
			}
		}
	}
	return formData;
};

// Simple assertion helper
function assertEquals(actual: any, expected: any, message: string) {
	if (actual !== expected) {
		throw new Error(`Assertion failed: ${message}. Expected "${expected}", but got "${actual}"`);
	}
}

function assertFormData(formData: FormData, expected: Record<string, string[]>, message: string) {
	const actual: Record<string, string[]> = {};
	formData.forEach((value, key) => {
		if (!actual[key]) {
			actual[key] = [];
		}
		actual[key].push(String(value));
	});

	const sortedActualKeys = Object.keys(actual).sort();
	const sortedExpectedKeys = Object.keys(expected).sort();

	if (JSON.stringify(sortedActualKeys) !== JSON.stringify(sortedExpectedKeys)) {
		throw new Error(
			`Assertion failed: ${message}. FormData keys mismatch. Expected keys: ${JSON.stringify(
				sortedExpectedKeys
			)}, Got keys: ${JSON.stringify(sortedActualKeys)}`
		);
	}

	for (const key of sortedActualKeys) {
		const actualValues = actual[key].sort();
		const expectedValues = expected[key].sort();
		if (JSON.stringify(actualValues) !== JSON.stringify(expectedValues)) {
			throw new Error(
				`Assertion failed: ${message}. FormData values mismatch for key "${key}". Expected: ${JSON.stringify(
					expectedValues
				)}, Got: ${JSON.stringify(actualValues)}`
			);
		}
	}
}


// Test suite
function describe(description: string, callback: () => void) {
	console.log(description);
	callback();
}

function it(description: string, callback: () => void) {
	try {
		callback();
		console.log(`  ✓ ${description}`);
	} catch (error) {
		console.error(`  ✗ ${description}`);
		console.error(error);
	}
}

// Mock File class for tests if not running in a browser-like environment
if (typeof File === 'undefined') {
  global.File = class MockFile {
    name: string;
    content: string[];
    constructor(content: string[], name: string) {
      this.name = name;
      this.content = content;
    }
    // Add any methods here that your code might use, e.g., slice, type
  } as any;
}


describe("objectToFormData", () => {
	it("should convert a simple flat object to FormData", () => {
		const obj = { name: "John Doe", age: 30 };
		const formData = objectToFormData(obj);
		assertFormData(formData, { name: ["John Doe"], age: ["30"] }, "Simple flat object");
	});

	it("should handle string, number, and boolean values", () => {
		const obj = {
			text: "hello",
			count: 123,
			isActive: true,
			isInactive: false
		};
		const formData = objectToFormData(obj);
		assertFormData(formData, {
			text: ["hello"],
			count: ["123"],
			isActive: ["true"],
			isInactive: ["false"]
		}, "String, number, and boolean values");
	});

	it("should ignore null and undefined values", () => {
		const obj = { name: "Test", value: null, data: undefined, age: 25 };
		const formData = objectToFormData(obj);
		assertFormData(formData, { name: ["Test"], age: ["25"] }, "Null and undefined values");
	});

	it("should handle an empty object", () => {
		const obj = {};
		const formData = objectToFormData(obj);
		assertFormData(formData, {}, "Empty object");
	});

	it("should handle File objects", () => {
		const file = new File(["content"], "test.txt");
		const obj = { document: file, id: "doc1" };
		const formData = objectToFormData(obj);
		
		assertEquals(formData.get("id"), "doc1", "File object - id field");
		const retrievedFile = formData.get("document") as File;
		assertEquals(retrievedFile instanceof File, true, "File object - document field is File");
		assertEquals(retrievedFile.name, "test.txt", "File object - file name");
		// Note: Comparing file content directly is tricky and environment-dependent.
		// Here, we primarily check for presence and name.
	});

	it("should handle arrays of strings/numbers", () => {
		const obj = { tags: ["node", "react", 123], ids: [1, 2, 3] };
		const formData = objectToFormData(obj);
		assertFormData(formData, {
			tags: ["node", "react", "123"],
			ids: ["1", "2", "3"]
		}, "Arrays of strings/numbers");
	});

	it("should handle arrays containing File objects", () => {
		const file1 = new File(["content1"], "file1.txt");
		const file2 = new File(["content2"], "file2.pdf");
		const obj = { documents: [file1, file2], description: "two files" };
		const formData = objectToFormData(obj);

		assertEquals(formData.get("description"), "two files", "Array of Files - description field");
		const retrievedFiles = formData.getAll("documents") as File[];
		assertEquals(retrievedFiles.length, 2, "Array of Files - count");
		assertEquals(retrievedFiles[0].name, "file1.txt", "Array of Files - file1 name");
		assertEquals(retrievedFiles[1].name, "file2.pdf", "Array of Files - file2 name");
	});

	it("should handle arrays with mixed content (string and File)", () => {
		const file = new File(["content"], "report.docx");
		const obj = { attachments: ["comment", file] };
		const formData = objectToFormData(obj);
		
		const attachments = formData.getAll("attachments");
		assertEquals(attachments.length, 2, "Array with mixed content - count");
		assertEquals(String(attachments[0]), "comment", "Array with mixed content - string item");
		assertEquals(attachments[1] instanceof File, true, "Array with mixed content - File item is File");
		assertEquals((attachments[1] as File).name, "report.docx", "Array with mixed content - File item name");
	});

    it("should handle arrays with null/undefined values", () => {
        const obj = { items: ["apple", null, "banana", undefined, "cherry"] };
        const formData = objectToFormData(obj);
        assertFormData(formData, { items: ["apple", "banana", "cherry"] }, "Arrays with null/undefined");
    });
});

// Basic console runner (optional, for environments without a test runner)
// (async () => {
//   console.log("Running Form.utils.test.ts...");
//   // This will automatically run the describe/it blocks due to their structure.
//   console.log("Tests finished.");
// })();
