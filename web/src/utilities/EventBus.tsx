const eventBus = {
  on(event: string, callback: (args: any) => any) {
    document.addEventListener(event, (e: Event) => callback((e as CustomEvent).detail));
  },
  dispatch(event: string, data: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event: string, callback: (args: any) => any) {
    document.removeEventListener(event, callback);
  },
};

export default eventBus;
