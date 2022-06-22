if ('serviceWorker' in navigator){
    navigator.serviceWorker.register("./service-worker.js").then(()=>{
        console.log('Service Worker is available');
    });
} else {
    console.log('Service Worker is unavailable');
}