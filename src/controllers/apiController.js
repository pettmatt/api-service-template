import apiService from "../services/apiService"

const apiController = {
    async makeApiRequest(req, res) {
        const result = await apiService.apiRequest(req.params.apikey)
    
        // Setting status code dynamically could make the code DRYer
        res.status(result.status).json({ message: result.message })
    }
}

export default apiController