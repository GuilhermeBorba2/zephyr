export const cnpjApi = {
  async fetch(cnpj: string): Promise<any> {
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      if (!response.ok) throw new Error('CNPJ não encontrado');
      return await response.json();
    } catch (error) {
      console.error('Error fetching CNPJ:', error);
      throw error;
    }
  }
};