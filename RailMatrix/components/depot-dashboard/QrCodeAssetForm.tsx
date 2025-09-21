"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image";
export default function QrCodeAssetForm() {
  const [activeTab, setActiveTab] = useState("manual")
  const [formTab, setFormTab] = useState("identification")
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [uid, setUid] = useState<string | null>(null)

  // For CSV Import
  const [csvPreview, setCsvPreview] = useState<any | null>(null)

  const [formData, setFormData] = useState({
    assetCategory: "",
    vendorId: "",
    vendorName: "",
    poNumber: "",
    lotNo: "",
    manufactureDate: "",
    supplyDate: "",
    material: "",
    dimensions: "",
    weight: "",
    surfaceFinish: "",
    qcPass: false,
    qcCert: "",
    qualityGrade: "",
    warranty: "",
    expectedLife: "",
    inspectionNotes: "",
  })

  // Handle change for input/select/textarea
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle CSV Upload (stub)
  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const rows = text.split("\n").map((r) => r.split(","))
    const columns = rows[0]
    const dataRows = rows.slice(1).map((r) => {
      const obj: any = {}
      columns.forEach((col, i) => {
        obj[col] = r[i]
      })
      return obj
    })

    setCsvPreview({ columns, rows: dataRows })
  }

  // Generate QR
  const handleGenerateQR = async () => {
    try {
      const payload = {
        uid_payload:
          formData.assetCategory +
          "-" +
          Math.random().toString(36).substr(2, 8).toUpperCase(),
        serial_number: formData.assetCategory + "-" + Date.now(),
        item_type: formData.assetCategory,
        vendor_id: formData.vendorId,
        vendor_name: formData.vendorName,
        po_number: formData.poNumber,
        lot_no: formData.lotNo,
        manufacture_date: formData.manufactureDate,
        supply_date: formData.supplyDate,
        material: formData.material,
        dimensions: formData.dimensions,
        weight_g: Number(formData.weight),
        surface_finish: formData.surfaceFinish,
        qc_pass: formData.qcPass,
        qc_cert_no: formData.qcCert,
        batch_quality_grade: formData.qualityGrade,
        warranty_months: Number(formData.warranty),
        expected_life_years: Number(formData.expectedLife),
        inspection_notes: formData.inspectionNotes,
      }

      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      console.log("data", data)
      setQrCode(data.qr_png_url)
      setUid(data.uid_payload)
      alert("Item created successfully!")

    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

  // Reset form
  const handleClearAll = () => {
    setFormTab("identification")
    setActiveTab("manual")
    setQrCode(null)
    setUid(null)
    setFormData({
      assetCategory: "",
      vendorId: "",
      vendorName: "",
      poNumber: "",
      lotNo: "",
      manufactureDate: "",
      supplyDate: "",
      material: "",
      dimensions: "",
      weight: "",
      surfaceFinish: "",
      qcPass: false,
      qcCert: "",
      qualityGrade: "",
      warranty: "",
      expectedLife: "",
      inspectionNotes: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-6 py-3 text-sm text-gray-700 border-b bg-white shadow-sm">
        <span className="font-medium">Current Location:</span> Zone - Central Railway | Division - Mumbai
      </div>

      <div className="flex">
        {/* Left Section */}
        <div className="w-2/3 border-r bg-white p-8">
          <h2 className="text-3xl font-bold text-green-700 mb-6">Asset Registration Form</h2>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Manual / Bulk */}
            <TabsList className="bg-gray-100 rounded-lg p-1 w-fit">
              <TabsTrigger value="manual" className="px-4 py-2 rounded-md">Manual Entry</TabsTrigger>
              <TabsTrigger value="bulk" className="px-4 py-2 rounded-md">Bulk Import</TabsTrigger>
            </TabsList>

            {/* Manual Entry */}
            <TabsContent value="manual">
              <Tabs value={formTab} onValueChange={setFormTab} className="space-y-6">
                {/* Sub-Tabs */}
                <TabsList className="bg-gray-100 rounded-lg p-1">
                  <TabsTrigger value="identification" className="px-4 py-2 rounded-md">Identification</TabsTrigger>
                  <TabsTrigger value="manufacturing" className="px-4 py-2 rounded-md">Manufacturing</TabsTrigger>
                  <TabsTrigger value="qc" className="px-4 py-2 rounded-md">Quality Control</TabsTrigger>
                  <TabsTrigger value="docs" className="px-4 py-2 rounded-md">Documentation</TabsTrigger>
                </TabsList>

                {/* Identification */}
                <TabsContent value="identification" className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label className="mb-2 block">Asset Category</Label>
                    <Select
                      onValueChange={(v) => setFormData((p) => ({ ...p, assetCategory: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Clip" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clip">Clip</SelectItem>
                        <SelectItem value="pad">Pad</SelectItem>
                        <SelectItem value="liner">Liner</SelectItem>
                        <SelectItem value="sleeper">Sleeper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Vendor ID</Label>
                    <Input
                      name="vendorId"
                      value={formData.vendorId}
                      onChange={handleChange}
                      placeholder="Enter 8-digit vendor code"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Vendor Name</Label>
                    <Input
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleChange}
                      placeholder="Authorized supplier name"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Purchase Order</Label>
                    <Input
                      name="poNumber"
                      value={formData.poNumber}
                      onChange={handleChange}
                      placeholder="PO/WO reference number"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Batch/Lot No</Label>
                    <Input
                      name="lotNo"
                      value={formData.lotNo}
                      onChange={handleChange}
                      placeholder="Manufacturing batch identifier"
                    />
                  </div>
                </TabsContent>

                {/* Manufacturing */}
                <TabsContent value="manufacturing" className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label className="mb-2 block">Manufacture Date</Label>
                    <Input type="date" name="manufactureDate" value={formData.manufactureDate} onChange={handleChange} />
                  </div>
                  <div>
                    <Label className="mb-2 block">Supply Date</Label>
                    <Input type="date" name="supplyDate" value={formData.supplyDate} onChange={handleChange} />
                  </div>
                  <div>
                    <Label className="mb-2 block">Base Material</Label>
                    <Select
                      onValueChange={(v) => setFormData((p) => ({ ...p, material: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Spring Steel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="steel">Spring Steel</SelectItem>
                        <SelectItem value="rubber">Rubber EVA</SelectItem>
                        <SelectItem value="hdpe">HDPE</SelectItem>
                        <SelectItem value="concrete">Concrete</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Dimensions</Label>
                    <Input
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleChange}
                      placeholder="Length × Width × Height (mm)"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Net Weight</Label>
                    <Input
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Weight in grams (g)"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Surface Finish</Label>
                    <Select
                      onValueChange={(v) => setFormData((p) => ({ ...p, surfaceFinish: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Phosphated" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phosphated">Phosphated</SelectItem>
                        <SelectItem value="galvanized">Galvanized</SelectItem>
                        <SelectItem value="painted">Painted</SelectItem>
                        <SelectItem value="raw">Raw</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* QC */}
                <TabsContent value="qc" className="grid grid-cols-2 gap-6 mt-4">
                  <div className="col-span-2">
                    <Label className="text-green-600 mb-2 block">QC Status</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="qcPass"
                        checked={formData.qcPass}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600"
                      />
                      <span className="text-green-600 font-semibold">Quality Control Passed</span>
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">QC Certificate</Label>
                    <Input name="qcCert" value={formData.qcCert} onChange={handleChange} placeholder="QC certificate reference number" />
                  </div>
                  <div>
                    <Label className="mb-2 block">Quality Grade</Label>
                    <Select onValueChange={(v) => setFormData((p) => ({ ...p, qualityGrade: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="A" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a">A</SelectItem>
                        <SelectItem value="b">B</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Warranty Period (months)</Label>
                    <Input name="warranty" value={formData.warranty} onChange={handleChange} placeholder="12" />
                  </div>
                  <div>
                    <Label className="mb-2 block">Expected Lifespan (years)</Label>
                    <Input name="expectedLife" value={formData.expectedLife} onChange={handleChange} placeholder="8" />
                  </div>
                </TabsContent>

                {/* Docs */}
                <TabsContent value="docs" className="mt-4 space-y-6">
                  <div>
                    <Label className="mb-2 block">Inspection Notes & Additional Comments</Label>
                    <Textarea
                      name="inspectionNotes"
                      value={formData.inspectionNotes}
                      onChange={handleChange}
                      placeholder="Enter notes or instructions..."
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={handleGenerateQR} className="bg-green-600 text-white">Generate UID & QR</Button>
                    <Button variant="secondary">Print Asset Label</Button>
                    <Button variant="secondary">Export QR Label</Button>
                    <Button variant="secondary">Create PDF Label</Button>
                    <Button className="bg-blue-600 text-white">Submit</Button>
                    <Button onClick={handleClearAll} className="bg-red-600 text-white">Clear All Fields</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Bulk Import */}
            <TabsContent value="bulk" className="mt-6">
              <div className="space-y-6">
                <div className="flex gap-3 items-center flex-wrap">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                    id="csvUpload"
                  />
                  <label htmlFor="csvUpload">
                    <Button asChild variant="secondary">
                      <span>Select CSV...</span>
                    </Button>
                  </label>
                  <Input placeholder="Batch name" className="w-1/3" />
                  <Button variant="secondary">Map Columns</Button>
                  <Button variant="secondary">Validate</Button>
                  <Button disabled={!csvPreview}>Start Import</Button>
                </div>

                <div className="border rounded-lg h-60 overflow-auto bg-gray-50">
                  {!csvPreview ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No columns in table
                    </div>
                  ) : (
                    <table className="min-w-full border-collapse">
                      <thead className="bg-gray-200 sticky top-0">
                        <tr>
                          {csvPreview.columns.map((col: string) => (
                            <th
                              key={col}
                              className="px-4 py-2 border text-left text-sm font-medium text-gray-700"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.rows.map((row: any, idx: number) => (
                          <tr key={idx} className="even:bg-gray-100">
                            {csvPreview.columns.map((col: string) => (
                              <td
                                key={col}
                                className="px-4 py-2 border text-sm text-gray-700"
                              >
                                {row[col] ?? ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Section */}
        <div className="w-1/3 bg-gray-50 p-6 flex flex-col gap-6">
          {/* QR Preview */}
          <div className="border rounded-xl bg-white shadow p-6 flex flex-col items-center justify-center text-gray-500 h-60">
            {qrCode ? (
              <>
                <div className="w-40 h-40 relative">
                  <Image
                    src={qrCode}
                    alt="Generated QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="font-medium text-gray-700">{uid}</p>
              </>
            ) : (
              <>
                <p className="font-medium">No QR code loaded</p>
                <p className="text-sm">QR Code will appear here</p>
              </>
            )}
          </div>


          <div className="text-sm flex justify-between text-gray-600">
            <span>Format: <span className="font-medium">QR Code 2D</span></span>
            <span>Resolution: <span className="font-medium">300 DPI</span></span>
          </div>

          {/* System Log */}
          <div className="border rounded-xl bg-white shadow p-4 text-sm">
            <h3 className="font-semibold text-green-700 mb-2">System Status & Activity Log</h3>
            <p className="text-gray-600">RailMatrix initialized.</p>
            <div className="mt-2 text-green-600 font-medium">● Online</div>
          </div>
        </div>
      </div>
    </div>
  )
}
