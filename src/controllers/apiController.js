import * as apiService from "../services/apiService.js"

export const makeApiRequest = async (req, res) => {
    const result = await apiService.apiRequest(req.params.apikey)

    // Setting status code dynamically could make the code DRYer
    res.status(result.status).json({ message: result.message })
}