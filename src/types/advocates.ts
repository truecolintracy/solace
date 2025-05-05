export type Advocate = {
  id?: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[] | unknown;
  yearsOfExperience: number;
  phoneNumber: string | number;
}