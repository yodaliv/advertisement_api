import {
    Body,
    Controller, Get, Param, Put, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { SettingService } from './setting.service';

@Controller('api/setting')
@ApiTags('Setting')
export class SettingController {
    constructor(
        private readonly settingService: SettingService,
    ) {}

    @Get('prices')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_prices(
        @Body() body: any,
    ) {

    }

    @Get('price/:name')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_price(
        @Param('name') name: string
    ) {
        const price  = await this.settingService.getPrice(name);
        return {success: true, price: price}
    }

    @Put('price/:name')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async set_price(
        @Param('name') name: string,
        @Body() body: any
    ) {
        const price  = await this.settingService.setPrice(name, body.price);
        console.log(price);
        return {success: true, price: price}
    }
}