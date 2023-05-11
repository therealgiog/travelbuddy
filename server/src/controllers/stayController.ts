import { Request, Response } from 'express';
import Trip, { ITripModel } from '../models/tripSchema';
import Stay, { IStayModel } from '../models/staySchema';

// Update a stay (PUT)
export const toggleStayInTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId: string = req.params.tripId;
    const trip: ITripModel | null = await Trip.findById(tripId);

    const stay: IStayModel = new Stay(req.body);
    await stay.validate();

    if (trip) {
      const stayIndex = trip.stays.findIndex((stay) => { 
        console.log('DB STAYS: ', stay.propertyId);
        console.log('INCOMING STAY: ', req.body.propertyId);
        stay.propertyId === req.body.propertyId});
      
      if (stayIndex > -1) {
        // stay exist, remove it
        trip.stays.splice(stayIndex, 1);
      } else {
        // stay does not exist, add it
        trip.stays.push(stay);
      }
      await trip.save();
    }
    res.status(200).send({ trip });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid stay data' });
      } else {
        res.status(500).send({ message: 'Error in toggleStayInTrip'});
      }
    } else {
      console.error('Caught an unexpected type of error:', error);
      res.status(500).send({ message: 'Unexpected error in toggleStayInTrip' });
    }
  }
}
