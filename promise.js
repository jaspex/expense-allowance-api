// var somePromise = new Promise((resolve, reject) => {
//     // Do something here like call a web api or write the the database stc.
//     // Whilst doing this the Promise is Pending

//     // Once the data is returned or saved etc then the Promise is Settled
//     // The Promise is either Settled as Resolved or Rejected
    
//     resolve({result: 1, message: 'Completed successfully' });
//     //reject('An error occurred!');
// });

// somePromise.then((result) => {
//     // This get's called if the promise is fulfilled
//     console.log('Success!', JSON.stringify(result, undefined, 2));
// }, (error) => {
//     // This get's called if the promise is fulfilled
//     console.log('Error. ', error);
// });


// An Async Add function
var asyncAdd = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof a === 'number' && typeof b === 'number') {
                resolve(a + b);
            } else {
                reject('The arguments are not valid');
            }
        }, 1500);
    });
};

// Promise chaining example, note we use catch to handle multiple chained promises
asyncAdd(7, '5').then((result) => {
    console.log(result);

    // Promise chaining
    return asyncAdd(result, 13)
}).then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
});
