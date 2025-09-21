import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
    uid_payload: { type: String, required: true },
    serial_number: { type: String, required: true },
    item_type: { type: String, required: true },
    vendor_id: { type: String, required: true },
    vendor_name: { type: String, required: true },
    po_number: { type: String, required: true },
    lot_no: { type: String, required: true },
    manufacture_date: { type: Date, required: true },
    supply_date: { type: Date, required: true },
    material: { type: String, required: true },
    dimensions: { type: String, required: true },
    weight_g: { type: Number, required: true },
    surface_finish: { type: String, required: true },
    qc_pass: { type: Boolean, default: false },
    qc_cert_no: { type: String, required: true },
    batch_quality_grade: { type: String, required: true },
    warranty_months: { type: Number, required: true },
    expected_life_years: { type: Number, required: true },
    inspection_notes: { type: String },
    qr_png_url: { type: String }  
},{timestamps:true})

const Item = mongoose.model("Item", itemSchema)
export default Item