declare interface NamedComponent extends React.FunctionComponent {
  componentName?: string;
}

declare interface ComponentWithProvider extends React.FunctionComponent {
  provider?: string;
}
