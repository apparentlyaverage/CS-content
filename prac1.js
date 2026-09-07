// sum, differecem product
const readline = require('readline');

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

rl.question("Enter your X value: ", (xn) => {
    rl.question("Enter your Y value: ", (yn) => {
        let x = Number(xn);
        let y = Number(yn);

        let sum = x+y;
        let prod = x*y;
        let difference = x-y;
        if (difference >= 0){
            difference = difference;
        } else {
            difference = difference*-1;
        }


        console.log("Sum = " + sum + "\nDifference = " + difference + "\nProduct = " + prod);

        rl.question("Enter the a time in seconds: ", (secs) => {
            let sec = Number(secs);
            let hours = 0;
            let minutes = 0;

            while(sec >= 60){
                sec-=60;
                minutes++;

            }

            while(minutes >= 60){
                minutes -=60;
                hours++;
            }

            console.log("H:"+ hours + " M:" + minutes + " S:" + sec);

            rl.question("What's your Height in meters?: ", (height) =>{
                let h = Number(height);

                h = (h*1000)/25.4;
                let f = 0;
                while(h >= 12){
                    f++;
                    h-=12;
                }
                console.log(height
                     + "metres = " + f + " feet " + Math.round(h,2) + " inches!");
                
                rl.close();
            })

            
        })
        
    })
})

