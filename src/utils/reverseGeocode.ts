import { supabase } from '../lib/supabase';

type GeocodeResponse = {
  display_name: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
};

export const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  try {
    // Round coordinates to 4 decimal places for caching
    const latRound = Math.round(latitude * 10000) / 10000;
    const lngRound = Math.round(longitude * 10000) / 10000;

    // Check if we already have this location cached
    const { data: cached } = await supabase
      .from('tgeo_tbl')
      .select('tgeo_display_name')
      .eq('tgeo_lat_round', latRound)
      .eq('tgeo_lng_round', lngRound)
      .maybeSingle();

    if (cached?.tgeo_display_name) {
      return cached.tgeo_display_name;
    }

    // Call Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'HRMS-ESS-App'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding API failed');
    }

    const data: GeocodeResponse = await response.json();
    
    if (!data.display_name) {
      throw new Error('No location found');
    }

    // Cache the result
    await supabase
      .from('tgeo_tbl')
      .insert({
        tgeo_lat_round: latRound,
        tgeo_lng_round: lngRound,
        tgeo_display_name: data.display_name,
        tgeo_city: data.address?.city,
        tgeo_state: data.address?.state,
        tgeo_country: data.address?.country,
        tgeo_postcode: data.address?.postcode,
        tgeo_source: 'nominatim'
      })
      .select()
      .single();

    return data.display_name;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};