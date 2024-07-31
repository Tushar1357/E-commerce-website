(async () =>{
    try{
    const response = await fetch('http://localhost:3000/cart/cart-value',{
        method: 'POST',
        credentials: 'include',
    })
    const data = await response.json()
    const keys = Object.keys(data)
    for (const key of keys){
        if (key !== 'total-cost'){
            const new_element = document.createElement('div')
            new_element.setAttribute('class','section-card border border-dark rounded p-3 d-flex justify-content-between')
            const detail = data[key]
            new_element.innerHTML = `<div class="product-name w-25">${key}</div> 
                        <div class="cost">Rs ${detail.cost}</div>
                        <div class="btn-group border border-dark rounded h-25">
                            <button class="minus w-25">-</button><div class="quantity text-center w-50 p-2">${detail.quantity}</div><button class="add-btn w-25">+</button>`
            document.getElementById('section').appendChild(new_element)
        }
    }
    document.getElementById('total-cost').innerText = `Total Cost - Rs ${data['total-cost']}`
}
catch{
    console.log("No product added in cart")
}

})();


document.getElementById('section').addEventListener('click',async (event)=>{
    if (event.target && event.target.classList.contains('add-btn')){
        const element = event.target
        const product_element = event.target.closest('.section-card')
        const product_name = product_element.innerText.split('\n')[0]
        const response = await fetch('http://localhost:3000/add_to_cart/',{
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({"product":product_name}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.text()
        const quantity = parseInt(element.previousSibling.innerText) + 1
        element.previousSibling.innerText = quantity
        const response_2 = await fetch('http://localhost:3000/cart/cart-value',{
            method: 'POST',
            credentials: 'include',
        })
        const data_2 = await response_2.json()
        const cost = (element.parentElement.previousElementSibling)
        cost.innerText = `Rs ${data_2[product_name]['cost']}`
        document.getElementById('total-cost').innerText = `Total Cost - Rs ${data_2['total-cost']}`


    }
})

document.getElementById('section').addEventListener('click',async (event)=>{
    if (event.target && event.target.classList.contains('minus')){

    const element = event.target
        const product_element = event.target.closest('.section-card')
        const product_name = product_element.innerText.split('\n')[0]
        const response = await fetch('http://localhost:3000/add_to_cart/dec-quantity',{
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({"product":product_name}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.text()
        const quantity = parseInt(element.nextSibling.innerText) - 1
        const response_2 = await fetch('http://localhost:3000/cart/cart-value',{
            method: 'POST',
            credentials: 'include',
        })
        const data_2 = await response_2.json()
        if (quantity == 0){
            product_element.remove()
        }
        else{
        element.nextSibling.innerText = quantity
        
        const cost = (element.parentElement.previousElementSibling)
        cost.innerText = `Rs ${data_2[product_name]['cost']}`
        
        }
        document.getElementById('total-cost').innerText = `Total Cost - Rs ${data_2['total-cost']}`
    }
})