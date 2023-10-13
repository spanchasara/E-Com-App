import { EntityState, EntityStore } from "@datorama/akita";
import { User } from "./user.model";
import { Injectable } from "@angular/core";


export interface State extends EntityState<User>{}

@Injectable({
    providedIn: 'root'
})
export class UserStore extends EntityStore<State, User>{
    constructor(){
        super();
    }
}