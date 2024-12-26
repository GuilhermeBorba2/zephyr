import { z } from 'zod';

export const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

export const validateCNPJ = (cnpj: string) => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  const weights1 = [5,4,3,2,9,8,7,6,5,4,3,2];
  const weights2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];

  const calc = (weights: number[]) => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weights[i];
    }
    const digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return digit;
  };

  const digit1 = calc(weights1);
  if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false;

  const digit2 = calc(weights2);
  if (digit2 !== parseInt(cleanCNPJ.charAt(13))) return false;

  return true;
};

export const fetchAddressByCEP = async (cep: string) => {
  const cleanCEP = cep.replace(/\D/g, '');
  if (cleanCEP.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();
    
    if (data.erro) return null;

    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      zipCode: cleanCEP
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};

export const clientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  company: z.string().min(2, 'Empresa deve ter no mínimo 2 caracteres'),
  document_type: z.enum(['cpf', 'cnpj']),
  document: z.string().refine(
    (val) => {
      const clean = val.replace(/\D/g, '');
      return clean.length === 11 ? validateCPF(clean) : validateCNPJ(clean);
    },
    'CPF/CNPJ inválido'
  ),
  zip_code: z.string().min(8, 'CEP inválido'),
  street: z.string().min(3, 'Endereço inválido'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro inválido'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().length(2, 'Estado inválido')
});

export type ClientFormData = z.infer<typeof clientSchema>;