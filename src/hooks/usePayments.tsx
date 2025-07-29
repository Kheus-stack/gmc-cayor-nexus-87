import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type Payment = Database['public']['Tables']['paiements']['Row']
type PaymentInsert = Database['public']['Tables']['paiements']['Insert']

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('paiements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setPayments(data || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addPayment = async (paymentData: PaymentInsert) => {
    try {
      const { data, error } = await supabase
        .from('paiements')
        .insert([paymentData])
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setPayments(prev => [data[0], ...prev])
        toast({
          title: "Succès",
          description: "Paiement ajouté avec succès"
        })
        return data[0]
      }
    } catch (error) {
      console.error('Error adding payment:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le paiement",
        variant: "destructive"
      })
      throw error
    }
  }

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      const { data, error } = await supabase
        .from('paiements')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setPayments(prev => 
          prev.map(payment => payment.id === id ? data[0] : payment)
        )
        toast({
          title: "Succès",
          description: "Paiement mis à jour"
        })
      }
    } catch (error) {
      console.error('Error updating payment:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le paiement",
        variant: "destructive"
      })
      throw error
    }
  }

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('paiements')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setPayments(prev => prev.filter(payment => payment.id !== id))
      toast({
        title: "Succès",
        description: "Paiement supprimé"
      })
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le paiement",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return {
    payments,
    loading,
    addPayment,
    updatePayment,
    deletePayment,
    refetch: fetchPayments
  }
}