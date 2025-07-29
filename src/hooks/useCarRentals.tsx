import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

// Interface temporaire jusqu'à ce que la table soit créée en DB
interface CarRental {
  id: string
  client_id: string
  vehicle_type: string
  pickup_date: string
  return_date: string
  daily_rate: number
  total_amount: number
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
}

export function useCarRentals() {
  const [rentals, setRentals] = useState<CarRental[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchRentals = async () => {
    setLoading(true)
    try {
      // TODO: Remplacer par la vraie requête Supabase quand la table sera créée
      // const { data, error } = await supabase
      //   .from('locations_vehicules')
      //   .select('*')
      //   .order('created_at', { ascending: false })
      
      // Simulation temporaire
      setRentals([])
    } catch (error) {
      console.error('Error fetching car rentals:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les locations de véhicules",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addRental = async (rentalData: Partial<CarRental>) => {
    try {
      // TODO: Remplacer par la vraie requête Supabase quand la table sera créée
      // const { data, error } = await supabase
      //   .from('locations_vehicules')
      //   .insert([rentalData])
      //   .select()
      
      // Simulation temporaire
      const newRental: CarRental = {
        id: Date.now().toString(),
        client_id: rentalData.client_id || '',
        vehicle_type: rentalData.vehicle_type || '',
        pickup_date: rentalData.pickup_date || '',
        return_date: rentalData.return_date || '',
        daily_rate: rentalData.daily_rate || 0,
        total_amount: rentalData.total_amount || 0,
        status: rentalData.status || 'active',
        created_at: new Date().toISOString()
      }
      
      setRentals(prev => [newRental, ...prev])
      toast({
        title: "Succès",
        description: "Location de véhicule ajoutée avec succès"
      })
      return newRental
    } catch (error) {
      console.error('Error adding car rental:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la location de véhicule",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateRental = async (id: string, updates: Partial<CarRental>) => {
    try {
      // TODO: Remplacer par la vraie requête Supabase quand la table sera créée
      setRentals(prev => 
        prev.map(rental => rental.id === id ? { ...rental, ...updates } : rental)
      )
      toast({
        title: "Succès",
        description: "Location de véhicule mise à jour"
      })
    } catch (error) {
      console.error('Error updating car rental:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la location de véhicule",
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteRental = async (id: string) => {
    try {
      // TODO: Remplacer par la vraie requête Supabase quand la table sera créée
      setRentals(prev => prev.filter(rental => rental.id !== id))
      toast({
        title: "Succès",
        description: "Location de véhicule supprimée"
      })
    } catch (error) {
      console.error('Error deleting car rental:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la location de véhicule",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchRentals()
  }, [])

  return {
    rentals,
    loading,
    addRental,
    updateRental,
    deleteRental,
    refetch: fetchRentals
  }
}