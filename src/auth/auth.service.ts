import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(wallet_address: string, signature: string): Promise<any> {

    const msg = 'Sign Message for CryptoGem';

    const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    if (wallet_address.toLowerCase() == address.toLowerCase()) {
      //// add user, if user exist, just return the user;
      const user = await this.userService.addUser({wallet_address: wallet_address}, false);
      return user;
    }

    return false;
  }

  login(user: any): string {
    const payload = {
      wallet_address: user.wallet_address,
      id: user.id,
    };
    return this.jwtService.sign(payload);
  }
}
