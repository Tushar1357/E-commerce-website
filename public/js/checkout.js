let form_status = 'close';

(async ()=>{
    const response = await fetch('http://localhost:3000/address/get_address',{
        method:'POST',
        credentials: 'include'
    })
    const data = await response.json()
    let i =0
    for (const item of data){
        const new_element = document.createElement('div')
        new_element.setAttribute('class','address border border-dark rounded d-flex justify-content-between')
        new_element.innerHTML = `<input type="radio" id="${item._id}" name="address-item">
                        <label for="${item._id}">
                        <p class="houseno">${item.hno}</p>
                        <p class="area">${item.area}</p>
                        <p class="city">${item.city}</p>
                    </label>`
            document.getElementById('address-list').appendChild(new_element)
    }
    const response_2 = await fetch('http://localhost:3000/cart/cart-value',{
        method: 'POST',
        credentials: 'include',
    })
    const data_2 = await response_2.json()
    console.log(data_2)
    document.getElementById('total-cost').innerText = `₹ ${data_2['total-cost']}`

})();

document.getElementById('add-address-btn').addEventListener('click',()=>{
    if (form_status === 'close'){
    document.getElementById('address-form').style.display = 'block'
    form_status = 'open'
    document.getElementById('add-address-btn').innerText = "Close"
    }
    else{
        document.getElementById('address-form').style.display = 'none'
        form_status = 'close'
        document.getElementById('add-address-btn').innerText = "Add Address"
    }
})


const form = document.getElementById('address-form')
form.addEventListener('submit',async (event)=>{
    event.preventDefault()
    const formdata = new FormData(form)
    const formobj = {}
    formdata.forEach((value,key)=>{
        formobj[key] = value
    })
    const response = await fetch('http://localhost:3000/address/add_address',{
        body: JSON.stringify(formobj),
        method:'POST',
        headers: {
                "Content-Type": "application/json"
            }
    })
    const data = await response.text()
    if (data === "Address added"){
        location.reload()
    }
    


})

let id = ''

document.getElementById('address-list').addEventListener('change',()=>{
    const elements = document.getElementsByName('address-item')
    for (const element of elements){
        if (element.checked){
            id = element.getAttribute('id')
        }
    }
})


document.getElementById('order').addEventListener('click',()=>{
    if (id){
        
    }
})
