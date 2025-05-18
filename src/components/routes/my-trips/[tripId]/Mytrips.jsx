import { db } from '@/Service/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useContext, useEffect } from 'react'
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom'
import TripInfo from '../Elements/TripInfo';
import Hotels from '../Elements/Hotels';
import { LogInContext } from '@/Context/LogInContext/Login';
import Places from '../Elements/Places';

class TripService {
  static async getTripById(tripId) {
    const docRef = doc(db, 'Trips', tripId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  static async execute(tripId) {
    return this.getTripById(tripId);
  }
}

function MyTrips() {
  const { tripId } = useParams();
  const { setTrip } = useContext(LogInContext);

  const getTripData = async () => {
    try {
      const tripData = await TripService.getTripById(tripId);
      if (tripData) {
        setTrip(tripData);
      } else {
        toast.error('No Such Trip');
      }
    } catch (error) {
      toast.error('Error fetching trip data');
      console.error(error);
    }
  };

  useEffect(() => {
    tripId && getTripData();
  }, [tripId]);

  return (
      <div className='py-2'>
        <TripInfo/>
        <Hotels/>
        <Places/>
      </div>
  )
}

export default MyTrips;