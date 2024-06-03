interface ContentProvider {
  register: () => Promise<ContentProvider>;
}

export default ContentProvider;
