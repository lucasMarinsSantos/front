"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clienteService from "@/services/clienteService";
import styles from './funcionario.module.css';

export default function CadastroCliente({ clienteId = null, initialData = null }) {
  const router = useRouter();
  const isEditing = !!clienteId;

  const initialFormData = initialData || {
    tipo_pessoa: 'F',
    nome: '',
    documento: '',
    email: '',
    telefone: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ',
    'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const tiposPessoa = [
    { label: 'Pessoa Física', value: 'F' },
    { label: 'Pessoa Jurídica', value: 'J' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'tipo_pessoa' ? { documento: '' } : {})
    }));
  };

  const handleDocumentoChange = (e) => {
    let onlyNums = e.target.value.replace(/[^0-9]/g, '');

    if (formData.tipo_pessoa === 'F') {
      if (onlyNums.length <= 11) {
        setFormData(prev => ({ ...prev, documento: onlyNums }));
      }
    } else {
      if (onlyNums.length <= 14) {
        setFormData(prev => ({ ...prev, documento: onlyNums }));
      }
    }
  };

  const handleCepChange = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    if (onlyNums.length <= 8) {
      setFormData(prev => ({ ...prev, cep: onlyNums }));
    }
  };

  const handleTelefoneChange = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    if (onlyNums.length <= 11) {
      setFormData(prev => ({ ...prev, telefone: onlyNums }));
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setError(null);
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }

    if (!formData.documento) {
      setError('Documento é obrigatório');
      return false;
    }

    if (formData.tipo_pessoa === 'F' && formData.documento.length !== 11) {
      setError('CPF deve ter 11 dígitos');
      return false;
    }

    if (formData.tipo_pessoa === 'J' && formData.documento.length !== 14) {
      setError('CNPJ deve ter 14 dígitos');
      return false;
    }

    if (!formData.email.trim()) {
      setError('E-mail é obrigatório');
      return false;
    }

    if (!formData.telefone) {
      setError('Telefone é obrigatório');
      return false;
    }

    if (!formData.cep) {
      setError('CEP é obrigatório');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await clienteService.updateCliente(clienteId, formData);
        alert('Cliente atualizado com sucesso!');
      } else {
        await clienteService.createCliente(formData);
        alert('Cliente cadastrado com sucesso!');
      }
      
      router.push('/comercial/clientes');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const documentoLabel = formData.tipo_pessoa === 'F' ? 'CPF *' : 'CNPJ *';
  const documentoPlaceholder = formData.tipo_pessoa === 'F' ? 'Digite apenas números do CPF' : 'Digite apenas números do CNPJ';
  const documentoMaxLength = formData.tipo_pessoa === 'F' ? 11 : 14;

  return (
    <div className={styles.allContainer}>
      <CardContent>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.title}>
            {isEditing ? 'Editar Cliente' : 'Cadastro de Cliente'}
          </h2>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.formGrid}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Tipo de Pessoa *</label>
              <Select 
                value={formData.tipo_pessoa || undefined}
                onValueChange={(value) => handleSelectChange('tipo_pessoa', value)} 
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de pessoa" />
                </SelectTrigger>
                <SelectContent>
                  {tiposPessoa.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label}>{documentoLabel}</label>
              <input
                name="documento"
                placeholder={documentoPlaceholder}
                value={formData.documento}
                onChange={handleDocumentoChange}
                required
                inputMode="numeric"
                maxLength={documentoMaxLength}
                className={styles.input}
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label}>Nome *</label>
              <input
                name="nome"
                placeholder="Digite o nome ou razão social"
                value={formData.nome}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label}>E-mail *</label>
              <input
                name="email"
                type="email"
                placeholder="exemplo@empresa.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label}>Telefone *</label>
              <input
                name="telefone"
                placeholder="Digite apenas números"
                value={formData.telefone}
                onChange={handleTelefoneChange}
                required
                inputMode="numeric"
                maxLength={11}
                className={styles.input}
              />
            </div>
          </div>

          <h3 className={styles.subtitle}>Endereço</h3>

          <div className={styles.formGrid}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>CEP *</label>
              <input
                name="cep"
                placeholder="Digite apenas números"
                value={formData.cep}
                onChange={handleCepChange}
                required
                inputMode="numeric"
                maxLength={8}
                className={styles.input}
              />
            </div>

            <div className={`${styles.inputWrapper} ${styles.span2}`}>
              <label className={styles.label}>Logradouro *</label>
              <input
                name="logradouro"
                placeholder="Rua, Avenida, etc."
                value={formData.logradouro}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label}>Número *</label>
              <input
                name="numero"
                placeholder="Número"
                value={formData.numero}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label}>Complemento</label>
              <input
                name="complemento"
                placeholder="Apartamento, bloco, etc."
                value={formData.complemento}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label}>Bairro *</label>
              <input
                name="bairro"
                placeholder="Bairro"
                value={formData.bairro}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label}>Cidade *</label>
              <input
                name="cidade"
                placeholder="Cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label}>UF *</label>
              <Select 
                value={formData.uf || undefined}
                onValueChange={(value) => handleSelectChange('uf', value)} 
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a UF" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <Button
              type="button"
              variant="clear"
              onClick={handleClear}
              disabled={isLoading}
            >
              Limpar
            </Button>
            <Button 
              type="submit" 
              variant="adicionar" 
              disabled={isLoading}
            >
              {isLoading ? 
                (isEditing ? 'Atualizando...' : 'Cadastrando...') : 
                (isEditing ? 'Atualizar' : 'Cadastrar')
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  );
}
