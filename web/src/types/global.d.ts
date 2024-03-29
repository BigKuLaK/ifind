declare module "react-slick" {}

declare type ID = string | number;

export declare global {
  interface Window {
    gtag: (event: string, action: string, data: { [key: string]: any }) => any;
    cookieconsent?: {
      initialise: (args: any) => any;
    };
    Highcharts: Highcharts;
  }

  interface NamedComponent extends React.FunctionComponent {
    componentName?: string;
  }

  interface ComponentWithProvider extends NamedComponent {
    provider?: string;
  }
}
