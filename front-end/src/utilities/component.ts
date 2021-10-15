export const withComponentName = (componentName: string) => (Component: React.FunctionComponent & NamedComponent) => {
    Component.componentName = componentName;
    return Component;
};

export const withProvider = (providerName: string) => (Component: ComponentWithProvider) => {
    Component.provider = providerName;
    return Component;
};
