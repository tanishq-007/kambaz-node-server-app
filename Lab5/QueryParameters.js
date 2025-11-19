export default function QueryParameters(app) {
    const calculator = (req, res) => {
        const { a, b, operation } = req.query;
        let result = 0;
        switch (operation) {
            case "add":
                result = parseInt(a) + parseInt(b);
                break;
            case "subtract":
                result = parseInt(a) - parseInt(b);
                break;
            case "multiply":
                result = parseInt(a) * parseInt(b);
                break;
            case "divide":
                const divisor = parseInt(b);
                if (divisor === 0) {
                    result = "Cannot divide by zero";
                } else {
                    result = parseInt(a) / divisor;
                }
                break;
            default:
                result = "Invalid operation";
        }
        res.send(result.toString());
    };
    app.get("/lab5/calculator", calculator);
}