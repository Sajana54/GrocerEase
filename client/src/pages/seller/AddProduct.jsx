import { useState } from "react";
import toast from "react-hot-toast";
// import axios from 'axios';
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
const AddProduct = () => {
    const [files, setFiles] = useState([null, null, null, null]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Vegetables');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    // const [useAppContext] = useState('');

    const {axios} = useAppContext()
    
    const onFileChange = (event, index) => {
        const newFiles = [...files];
        newFiles[index] = event.target.files[0];
        setFiles(newFiles);
    };
    
    const onSubmitHandler = async (event) => {
        try{
            console.log(name,description,category,price,offerPrice)
            event.preventDefault();
            if (!name || !description || !category || !price || !offerPrice) {
                toast.error("Please fill all the fields.");
                return;
            }
            const productData ={
                name,
                description: description.split('\n'),
                category,
                price,
                offerPrice
            }
            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            for (let i = 0; i < files.length; i++){
                formData.append('images', files[i])
            }
            const {data} = await axios.post('/api/product/add', formData)
            if (data.success){
                // toast.success(data.message);
                console.log("Product Submitted:", productData);
                toast.success("Product added successfully!");
                setName('');
                setDescription('' );
                setCategory('Vegetables');
                setPrice('');
                setOfferPrice('');
                setFiles([]);
            }else
                {
                    toast.error(data.message)
                        console.log(data.message) 
                    alert('h')
                    
                }
            }catch(error){
            alert('hi')
toast.error(error.message)
console.error(error.message)
        }
       
       

    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={(e) => {onSubmitHandler(e)}} className="md:p-10 p-4 space-y-5 max-w-lg">
                {/* Product Image */}
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input
                                    accept="image/*"
                                    type="file"
                                    id={`image${index}`}
                                    hidden
                                    onChange={(e) => onFileChange(e, index)}
                                />
                                <img
                                    src={
                                        files[index]
                                            ? URL.createObjectURL(files[index])
                                            : assets.upload_area}
                                    alt="uploadArea"
                                    className="max-w-24 cursor-pointer border rounded"
                                    width={100}
                                    height={100}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Product Name */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label htmlFor="product-name" className="text-base font-medium">Product Name</label>
                    <input
                        id="product-name"
                        type="text"
                        placeholder="Type here"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label htmlFor="product-description" className="text-base font-medium">Product Description</label>
                    <textarea
                        id="product-description"
                        rows={4}
                        placeholder="Type here"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                    />
                </div>

                {/* Category */}
                <div className="w-full flex flex-col gap-1">
                    <label htmlFor="category" className="text-base font-medium">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => {
                            console.log(e.target.value)
                            setCategory(e.target.value)}}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    >
                        {[
                            'Vegetables',
                            'Fresh Fruits',
                            'Cold Drinks',
                            'Instant Food',
                            'Dairy Products',
                            'Bakery and Breads',
                            'Grains and Cereals'
                        ].map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                        ))}

                    </select>
                </div>

                {/* Prices */}
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label htmlFor="product-price" className="text-base font-medium">Product Price</label>
                        <input
                            id="product-price"
                            type="number"
                            placeholder="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label htmlFor="offer-price" className="text-base font-medium">Offer Price</label>
                        <input
                            id="offer-price"
                            type="number"
                            placeholder="0"
                            
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-8 py-2.5 bg-[#4fbf8b] text-white font-medium rounded hover:bg-[#3ea77a] transition"
                >
                    ADD
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
