import Inventory from '../model/inventory.model.js'
import Dispatch from '../model/dispatch.model.js'
import Warranty from '../model/warranty.model.js'


export const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDispatchOrders = async (req, res) => {
  try {
    const orders = await Dispatch.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDispatch = async (req, res) => {
  try {
    const { dispatchId, status } = req.body;
    const updated = await Dispatch.findByIdAndUpdate(dispatchId, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getWarrantyClaims = async (req, res) => {
  try {
    const claims = await Warranty.find();
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const processWarranty = async (req, res) => {
  try {
    const { claimId, reportedBy } = req.body;
    const updated = await Warranty.findByIdAndUpdate(
      claimId,
      { status: "Approved", reportedBy },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, claim: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
