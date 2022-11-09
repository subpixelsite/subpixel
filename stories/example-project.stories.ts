import { html, TemplateResult } from 'lit';
import '../src/example-project.js';

export default {
  title: 'ExampleProject',
  component: 'example-project',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  title?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ title, backgroundColor = 'white' }: ArgTypes) => html`
  <example-project style="--example-project-background-color: ${backgroundColor}" .title=${title}></example-project>
`;

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
