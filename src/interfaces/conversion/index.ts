import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ConversionInterface {
  id?: string;
  timecode: string;
  frame_count: number;
  length: number;
  duration: number;
  frames_per_second: number;
  format: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface ConversionGetQueryInterface extends GetQueryInterface {
  id?: string;
  timecode?: string;
  format?: string;
  user_id?: string;
}
