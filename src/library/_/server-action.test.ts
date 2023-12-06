import { describe, expect, it } from "@jest/globals";

import { normalizeFormData } from "./server-action";

describe(normalizeFormData.name, () => {
	it("parses empty form", () => {
		const formData = new FormData();

		expect(normalizeFormData(formData)).toEqual({});
	});

	it("parses basic form", () => {
		const form = document.createElement("form");

		const answer = document.createElement("input");

		answer.name = "answer";
		answer.value = "42";

		form.appendChild(answer);

		const formData = new FormData(form);

		expect(normalizeFormData(formData)).toEqual({
			answer: "42"
		});
	});

	it("parses complex form", () => {
		const form = document.createElement("form");

		const foo = document.createElement("input");

		foo.name = "deeply.nested.foo";
		foo.value = "foo";

		form.appendChild(foo);

		const bar = document.createElement("input");

		bar.name = "deeply.nested.bar";
		bar.value = "bar";

		form.appendChild(bar);

		const red = document.createElement("input");

		red.name = "colors.0";
		red.value = "red";

		form.appendChild(red);

		const green = document.createElement("input");

		green.name = "colors.1";
		green.value = "green";

		form.appendChild(green);

		const blue = document.createElement("input");

		blue.name = "colors.2";
		blue.value = "blue";

		form.appendChild(blue);

		const thomas = document.createElement("input");

		thomas.name = "people.0.name";
		thomas.value = "Thomas";

		form.appendChild(thomas);

		const allea = document.createElement("input");

		allea.name = "people.1.name";
		allea.value = "Allea";

		form.appendChild(allea);

		const formData = new FormData(form);

		expect(normalizeFormData(formData)).toEqual({
			deeply: {
				nested: {
					foo: "foo",
					bar: "bar"
				}
			},
			colors: ["red", "green", "blue"],
			people: [{ name: "Thomas" }, { name: "Allea" }]
		});
	});
});
