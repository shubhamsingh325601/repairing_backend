const findOne = async (model, filter) => {
    try {
      return await model.findOne(filter);
    } catch (error) {
      throw new Error(`Error finding document: ${error.message}`);
    }
};
  
const findMany = async (model, filter) => {
    try {
        return await model.find(filter);
    } catch (error) {
        throw new Error(`Error finding documents: ${error.message}`);
    }
};

const createOne = async (model, data) => {
    try {
        const newDocument = new model(data);
        return await newDocument.save();
    } catch (error) {
        throw new Error(`Error creating document: ${error.message}`);
    }
};

const updateOne = async (model, filter, updateData) => {
    try {
        return await model.findOneAndUpdate(filter, updateData, { new: true });
    } catch (error) {
        throw new Error(`Error updating document: ${error.message}`);
    }
};

const deleteOne = async (model, filter) => {
    try {
        return await model.deleteOne(filter);
    } catch (error) {
        throw new Error(`Error deleting document: ${error.message}`);
    }
};

module.exports = {
    findOne,
    findMany,
    createOne,
    updateOne,
    deleteOne
};
