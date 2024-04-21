import { Request, Response } from 'express';
import { AccountRepository } from '../infra/repository/account.repository';
import { RideRepository } from '../infra/repository/ride.repository';
import { RequestRideService } from '../application/request-ride.service';

class RidePostResponseDto {
    constructor(readonly rideId: string) {}
}

export class RideController {
    private readonly rideRequestService: RequestRideService;

    constructor(private readonly accountRepository: AccountRepository, private readonly rideRepository: RideRepository) {
        this.rideRequestService = new RequestRideService(this.accountRepository, this.rideRepository);
    }

    async post(req: Request, res: Response) {
        try {
            const rideId = await this.rideRequestService.execute(req.body);
            return res.status(201).send(new RidePostResponseDto(rideId));
        } catch (err: any) {
            if (err instanceof Error) res.status(422).send({ message: err.message });
            return res.status(500).send();
        }
    }
}