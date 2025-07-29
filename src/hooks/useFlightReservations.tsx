import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

// Interface temporaire jusqu'à ce que la table soit créée en DB
interface FlightReservation {
  id: string
  client_id: string
  flight_number: string
  departure: string
  destination: string
  departure_date: string
  passengers: number
  total_price: number
  status: 'confirmed' | 'pending' | 'cancelled'
  created_at: string
}

export function useFlightReservations() {
  const [reservations, setReservations] = useState<FlightReservation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchReservations = async () => {
    setLoading(true)
    try {
      // TODO: Remplacer par la vraie requête Supabase quand la table sera créée
      setReservations([])
    } catch (error) {
      console.error('Error fetching flight reservations:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations de vol",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addReservation = async (reservationData: Partial<FlightReservation>) => {
    try {
      // TODO: Remplacer par la vraie requête Supabase quand la table sera créée
      const newReservation: FlightReservation = {
        id: Date.now().toString(),
        client_id: reservationData.client_id || '',
        flight_number: reservationData.flight_number || '',
        departure: reservationData.departure || '',
        destination: reservationData.destination || '',
        departure_date: reservationData.departure_date || '',
        passengers: reservationData.passengers || 1,
        total_price: reservationData.total_price || 0,
        status: reservationData.status || 'confirmed',
        created_at: new Date().toISOString()
      }
      
      setReservations(prev => [newReservation, ...prev])
      toast({
        title: "Succès",
        description: "Réservation de vol ajoutée avec succès"
      })
      return newReservation
    } catch (error) {
      console.error('Error adding flight reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la réservation de vol",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateReservation = async (id: string, updates: Partial<FlightReservation>) => {
    try {
      // TODO: Remplacer par la vraie requête Supabase quand la table sera créée
      setReservations(prev => 
        prev.map(reservation => reservation.id === id ? { ...reservation, ...updates } : reservation)
      )
      toast({
        title: "Succès",
        description: "Réservation de vol mise à jour"
      })
    } catch (error) {
      console.error('Error updating flight reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réservation de vol",
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
        description: "Réservation de vol supprimée"
      })
    } catch (error) {
      console.error('Error deleting flight reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation de vol",
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