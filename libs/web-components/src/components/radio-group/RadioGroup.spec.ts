import '@testing-library/jest-dom';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/svelte';
import GoARadioGroupWrapper from './RadioGroupWrapper.test.svelte';
import GoARadioGroup from './RadioGroup.svelte';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe("GoARadioGroup Component", () => {
  it("should render", async () => {
    const mock = jest.spyOn(console, "error").mockImplementation();
    const items = ["red", "blue", "orange"];
    const result = render(GoARadioGroupWrapper, {
      name: 'favcolor',
      value: 'orange',
      testid: 'test-id',
      items,
    });

    await waitFor(() => {
      for (const item of items) {
        const radio = result.queryByTestId(`radio-option-${item}`);
        expect(radio).toBeTruthy();
        const input = radio.querySelector("input");
        expect(input).toHaveAttribute("name", "favcolor");
      }
    });

    await waitFor(() => {
      expect(console.error["mock"].calls.length).toBe(0);
    });
    mock.mockRestore();
  });

  it("should handle the events", async () => {
    const items = ["red", "blue", "orange"];
    const result = render(GoARadioGroupWrapper, {
      name: 'favcolor',
      value: 'orange',
      testid: 'test-id',
      items,
    });

    const radioGroup = await result.findByTestId("test-id");

    // initial state
    await waitFor(() => {
      const orange = radioGroup.querySelector<HTMLInputElement>(
        "input[type=radio][value=orange]",
      );
      const red = radioGroup.querySelector<HTMLInputElement>(
        "input[type=radio][value=red]",
      );
      expect(red.checked).toBe(false);
      expect(orange.checked).toBe(true);

      fireEvent.click(red);
      expect(red.checked).toBe(true);
      expect(orange.checked).toBe(false);
    });
  });


  describe("Margins", () => {
    it(`should add the margin`, async () => {
      const baseElement = render(GoARadioGroup, {
        testid: "radiogroup-test",
        name: "test",
        value: "",
        mt: "s",
        mr: "m",
        mb: "l",
        ml: "xl",
      });
      const radiogroup = await baseElement.findByTestId("radiogroup-test");

      expect(radiogroup).toBeTruthy();
      expect(radiogroup).toHaveStyle("margin-top:var(--goa-spacing-s)");
      expect(radiogroup).toHaveStyle("margin-right:var(--goa-spacing-m)");
      expect(radiogroup).toHaveStyle("margin-bottom:var(--goa-spacing-l)");
      expect(radiogroup).toHaveStyle("margin-left:var(--goa-spacing-xl)");
    });
  });
});
