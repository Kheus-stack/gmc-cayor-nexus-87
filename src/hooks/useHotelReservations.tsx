import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

// Interface temporaire jusqu'à ce que la table soit créée en DB
interface HotelReservation {
  id: string
  client_id: string
  hotel_name: string
  check_in: string
  check_out: string
  rooms: number
  total_price: number
  status: 'confirmed' | 'pending' | 'cancelled'
  created_at: string
}

export function useHotelReservations() {
  const [reservations, setReservations] = useState<HotelReservation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchReservations = async () => {
    setLoading(true)
    try {
      // TODO: Remplacer par la vraie requête Supabase quand la table sera créée
      setReservations([])
    } catch (error) {
      console.error('Error fetching hotel reservations:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations d'hôtel",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addReservation = async (reservationData: Partial<HotelReservation>) => {
    try {
      // TODO: Remplacer par la vraie requête Supabase quand la table sera créée
      const newReservation: HotelReservation = {
        id: Date.now().toString(),
        client_id: reservationData.client_id || '',
        hotel_name: reservationData.hotel_name || '',
        check_in: reservationData.check_in || '',
        check_out: reservationData.check_out || '',
        rooms: reservationData.rooms || 1,
        total_price: reservationData.total_price || 0,
        status: reservationData.status || 'confirmed',
        created_at: new Date().toISOString()
      }
      
      setReservations(prev => [newReservation, ...prev])
      toast({
        title: "Succès",
        description: "Réservation d'hôtel ajoutée avec succès"
      })
      return newReservation
    } catch (error) {
      console.error('Error adding hotel reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la réservation d'hôtel",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateReservation = async (id: string, updates: Partial<HotelReservation>) => {
    try {
      // TODO: Remplacer par la vraie requête Supabase quand la table sera créée
      setReservations(prev => 
        prev.map(reservation => reservation.id === id ? { ...reservation, ...updates } : reservation)
      )
      toast({
        title: "Succès",
        description: "Réservation d'hôtel mise à jour"
      })
    } catch (error) {
      console.error('Error updating hotel reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réservation d'hôtel",
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteReservation = async (id: string) => {
    try {
      // TODO: Remplacer par la vraie requête Supabase quand la table sera créée
      setReservations(prev => prev.filter(reservation => reservation.id !== id))
      toast({
        title: "Succès",
        description: "Réservation d'hôtel supprimée"
      })
    } catch (error) {
      console.error('Error deleting hotel reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation d'hôtel",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  return {
    reservations,
    loading,
    addReservation,
    updateReservation,
    deleteReservation,
    refetch: fetchReservations
  }
}