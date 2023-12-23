const canvas = document.getElementById("gameCanvas");
const rocksTxt = document.getElementById("rocks");
const papersTxt = document.getElementById("papers");
const scissorsTxt = document.getElementById("scissorss");

const ctx = canvas.getContext("2d");

const rockImg = document.body.appendChild(new Image());
const paperImg = document.body.appendChild(new Image());
const scissorsImg = document.body.appendChild(new Image());

const chanceForEntityToSpawn = 5;

document.body.onload = init;

const rock = "rock";
const paper = "paper";
const scissors = "scissors";

let hasStarted = false;
let paused = false;

function start()
{
    hasStarted = true;
}

function pause()
{
    if(paused == true) 
    {
        paused = false;
        requestAnimationFrame(update);
    }
    else paused = true;
}

function restart()
{
    entitys.splice(0, entitys.length)
    spawnAll()
}

function add()
{
    spawnAll()
}

// https://stackoverflow.com/a/60117978/20899550
const percentages = (xs) => xs.reduce((pcts, x) => ({...pcts, [x]: (pcts [x] || 0) + 100 / (xs.length)}), {})

const entitys = new Array();

class Entity
{
    constructor(x, y, velx, vely, width, height, type)
    {
        this.x = x;
        this.y = y;
        this.velx = velx;
        this.vely = vely;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    draw()
    {
        switch(this.type)
        {
            case rock:
                ctx.drawImage(rockImg, this.x, this.y, this.width, this.height);
                break;
            case paper:
                ctx.drawImage(paperImg, this.x, this.y, this.width, this.height);
                break;
            case scissors:
                ctx.drawImage(scissorsImg, this.x, this.y, this.width, this.height);
                break;
            default:
                break;
        }
    }

    _checkIfColliding()
    {
        for(let entity of entitys)
        {
            if(
                this.x < entity.x + entity.width &&
                this.x + this.width > entity.x &&
                this.y < entity.y + entity.height &&
                this.y + this.height > entity.y
            ) 
            {
                switch(entity.type)
                {
                    case rock:
                        if(this.type == paper)
                        {
                            entity.type = paper;
                            entity.setVel(1, 1.5);
                            this.velx = -this.velx
                        } 
                        if(this.type == scissors)
                        {   
                            this.type = rock
                            this.setVel(.5, .5);
                            this.vely = -this.vely
                        } 
                        break;
                    case paper:
                        if(this.type == rock) 
                        {
                            this.type = paper
                            this.setVel(1, 1.5);
                            this.velx = -this.velx
                        };
                        if(this.type == scissors) 
                        {
                            entity.type = scissors;
                            entity.setVel(1, .5);
                            this.vely = -this.vely
                        };
                        break;
                    case scissors:
                        if(this.type == paper) 
                        {
                            this.type = scissors;
                            this.setVel(1, .5);
                            this.velx = -this.velx
                        };
                        if(this.type == rock) 
                        {
                            entity.type = rock
                            entity.setVel(.5, .5);
                            this.vely = -this.vely
                        };
                        break;
                }
            }
        }          
    }

    setVel(x, y)
    {
        this.velx = x;
        this.vely = y;
    }

    update()
    {
        this.x += this.velx;
        this.y += this.vely;

        if(this.x < 0 || this.x > canvas.width)
        {
            this.velx = -this.velx;
        } 
        if(this.y < 0 || this.y > canvas.height) 
        {
            this.vely = -this.vely;
        }

        this._checkIfColliding();
    }
}

function getRandomInt(max) 
{
    return Math.floor(Math.random() * max);
}

function prepImages()
{
    rockImg.src = './images/rock.png';
    paperImg.src = './images/paper.png';
    scissorsImg.src = './images/scissors.png';

    rockImg.width = rockImg.height = 30;
    paperImg.width = paperImg.height = 30;
    scissorsImg.width = scissorsImg.height = 30;

    rockImg.style = 'display: none;';
    paperImg.style = 'display: none;';
    scissorsImg.style = 'display: none;';

    rockImg.id = 'rock';
    paperImg.id = 'paper';
    scissorsImg.id = 'scissors';

    scissorsImg.onload = spawnAll;
}

function spawnAll()
{
    for(let x = 0; x < canvas.width; x+=12)
    {
        for(let y = 0; y < canvas.height; y+=12)
        {
            const random = getRandomInt(chanceForEntityToSpawn);
            if(random > chanceForEntityToSpawn / 2)
            {
                const random2 = getRandomInt(4);
                if(random2 == 1)
                {
                    entitys.push(new Entity(x, y, .5, .5, 10, 10, rock))
                } 
                else if(random2 == 2)
                {
                    entitys.push(new Entity(x, y, 1, 1.5, 10, 10, paper))
                } 
                else if(random2 == 3)
                {
                    entitys.push(new Entity(x, y, 1, .5, 10, 10, scissors))
                }
            }
        }
    }
}

function init()
{
    prepImages();
}

function update()
{
    if(hasStarted)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        entitys.forEach((entity) => {
            entity.draw();
            entity.update();
        });

        const names = [];
        for(let i of entitys)
        {
            names.push(i.type)
        }
        const all = percentages(names);

        try { rocksTxt.innerText = "Rock: " + all["rock"].toFixed(1).toString() + '%' } catch { rocksTxt.innerText = "Rock: lost" }
        try { papersTxt.innerText = "Paper: " + all["paper"].toFixed(1).toString() + '%' } catch { papersTxt.innerText = "Paper: lost" }
        try { scissorsTxt.innerText = "Scissors: " + all["scissors"].toFixed(1).toString() + '%' } catch { scissorsTxt.innerText = "Scissors: lost" }
    }

    if(!paused) requestAnimationFrame(update);
}
requestAnimationFrame(update)