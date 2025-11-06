export const useMultiTenantAuth = () => {
  const loadForEmail = async (email: string) => {
    // Placeholder implementation
    console.log('Loading tenant context for:', email);
  };

  return { loadForEmail };
};