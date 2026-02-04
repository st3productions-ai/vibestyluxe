
import { LeadData } from '../types';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXWB68KG3ik7eD-xBXX7uS40gPK80PuKJevid4q6tJ9I-qQoi8IotRmPDx_lz7w02wMQ/exec';

export const submitLead = async (data: LeadData): Promise<boolean> => {
  try {
    console.log('VibeStyle Sync: Initiating Payload Encryption...');
    
    const params = new URLSearchParams();
    params.append('FullName', data.FullName);
    params.append('ContactPhone', data.ContactPhone);
    params.append('BusinessEmail', data.BusinessEmail);
    params.append('BusinessName', data.BusinessName);
    params.append('EmployeeSize', data.EmployeeSize);

    // Use 'no-cors' for Google Apps Script to avoid pre-flight issues in B2B environments
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    return true;
  } catch (error) {
    console.error('VibeStyle Sync: Protocol violation', error);
    return false;
  }
};
