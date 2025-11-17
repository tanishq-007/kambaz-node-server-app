export default function Hello(app){
    const sayHello =(req,res) =>{
        res.send("hello");
    };
    const sayWelcome=(req,res) =>
    {
        res.send("This is Tanishqneela");
    }
app.get('/hello', sayHello)
app.get('/',sayWelcome)
}
