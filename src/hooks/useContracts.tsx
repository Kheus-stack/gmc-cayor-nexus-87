import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type Contract = Database['public']['Tables']['contrats']['Row']
type ContractInsert = Database['public']['Tables']['contrats']['Insert']

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchContracts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('contrats')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setContracts(data || [])
    } catch (error) {
      console.error('Error fetching contracts:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les contrats",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addContract = async (contractData: ContractInsert) => {
    try {
      const { data, error } = await supabase
        .from('contrats')
        .insert([contractData])
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setContracts(prev => [data[0], ...prev])
        toast({
          title: "Succès",
          description: "Contrat ajouté avec succès"
        })
        return data[0]
      }
    } catch (error) {
      console.error('Error adding contract:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le contrat",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateContract = async (id: string, updates: Partial<Contract>) => {
    try {
      const { data, error } = await supabase
        .from('contrats')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setContracts(prev => 
          prev.map(contract => contract.id === id ? data[0] : contract)
        )
        toast({
          title: "Succès",
          description: "Contrat mis à jour"
        })
      }
    } catch (error) {
      console.error('Error updating contract:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le contrat",
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteContract = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contrats')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setContracts(prev => prev.filter(contract => contract.id !== id))
      toast({
        title: "Succès",
        description: "Contrat supprimé"
      })
    } catch (error) {
      console.error('Error deleting contract:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contrat",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  return {
    contracts,
    loading,
    addContract,
    updateContract,
    deleteContract,
    refetch: fetchContracts
  }
}