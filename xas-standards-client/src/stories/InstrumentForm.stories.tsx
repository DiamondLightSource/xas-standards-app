import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import InstrumentForm from "../components/submission/InstrumentForm";
import "../components/StandardSubmission.css";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "XAS-Standards/InstrumentForm",
  component: InstrumentForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs eElementFormntry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  //   argTypes: {
  //     onClickElement: { control: "color" },
  //     elementSize: number,
  //   },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { setBeamlineId: fn(), setDate: fn() },
} satisfies Meta<typeof InstrumentForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    beamlines: [],
    beamlineHeader: "Test beamline",
    beamlineId: 0,
    date: "",
  },
};
