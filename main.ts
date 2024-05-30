#! /usr/bin/env node
import inquirer from 'inquirer';

type Direction = 'north' | 'south' | 'east' | 'west';

interface Room {
    description: string;
    directions: Partial<Record<Direction, string>>;
    item?: string;
    challenge?: string;
}

class AdventureGame {
    private rooms: Record<string, Room>;
    private currentRoom: string;
    private inventory: string[];

    constructor() {
        this.rooms = this.createRooms();
        this.currentRoom = 'entrance';
        this.inventory = [];
    }

    private createRooms(): Record<string, Room> {
        return {
            entrance: {
                description: 'You are at the entrance of a dark cave.',
                directions: { north: 'hallway' }
            },
            hallway: {
                description: 'You are in a long hallway. There is a faint light coming from the north.',
                directions: { south: 'entrance', north: 'treasureRoom' },
                item: 'torch'
            },
            treasureRoom: {
                description: 'You have found the treasure room. There is a treasure chest here!',
                directions: { south: 'hallway' },
                challenge: 'You need a torch to see the treasure.'
            }
        };
    }

    public async play() {
        this.describeCurrentRoom();
        while (true) {
            const action = await this.promptAction();
            if (action === 'Move') {
                const direction = await this.promptDirection();
                this.move(direction);
            } else if (action === 'Pick up item') {
                this.pickUpItem();
            } else if (action === 'Show inventory') {
                this.showInventory();
            } else if (action === 'Exit game') {
                console.log('Thanks for playing!');
                break;
            }
        }
    }

    private async promptAction() {
        const answer = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: ['Move', 'Pick up item', 'Show inventory', 'Exit game']
        });
        return answer.action;
    }

    private async promptDirection() {
        const answer = await inquirer.prompt({
            type: 'list',
            name: 'direction',
            message: 'Which direction do you want to go?',
            choices: ['north', 'south', 'east', 'west']
        });
        return answer.direction as Direction;
    }

    private move(direction: Direction): void {
        const newRoom = this.rooms[this.currentRoom].directions[direction];
        if (newRoom) {
            this.currentRoom = newRoom;
            this.describeCurrentRoom();
        } else {
            console.log("You can't go that way.");
        }
    }

    private pickUpItem(): void {
        const item = this.rooms[this.currentRoom].item;
        if (item) {
            this.inventory.push(item);
            delete this.rooms[this.currentRoom].item;
            console.log(`You picked up: ${item}`);
        } else {
            console.log("There's nothing to pick up here.");
        }
    }

    private describeCurrentRoom(): void {
        const room = this.rooms[this.currentRoom];
        console.log(room.description);

        if (room.item) {
            console.log(`You see a ${room.item} here.`);
        }

        if (room.challenge && this.currentRoom === 'treasureRoom' && !this.inventory.includes('torch')) {
            console.log(room.challenge);
        } else if (this.currentRoom === 'treasureRoom') {
            console.log("Congratulations! You can see the treasure chest. You've won the game!");
        }
    }

    private showInventory(): void {
        if (this.inventory.length > 0) {
            console.log(`You have: ${this.inventory.join(', ')}`);
        } else {
            console.log("You don't have any items.");
        }
    }
}

// Initialize and start the game
const game = new AdventureGame();
game.play();
