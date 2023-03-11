function deleteAndWeld1(EndStart){
    if(EndStart.length == 2){

        EndStart.forEach((e)=>{
            
            e.c.removeConnected({c:pathTD,f:e.f})
            
        })
        console.log("ONE");
        console.log(EndStart.slice());

        //EndStart[0].c.removeConnected({c:EndStart[1].c,f:EndStart[1].f})



        let A = EndStart[0].c
        let Ainner
        let Aouter

        //start of first line is its end or start
        let AJbegin
        //end of second line is its end or start
        let BJend
        
        console.log(A.data.conEnd);
        if(A.data.conEnd.some(e => e.c.id == pathTD.id)){
            //outer is start and inner is end
            AJbegin="start"
            console.log("CON END on A is INNER");
            Ainner = A.data.conEnd

            Aouter = EndStart[0].c.data.conStart//A.data.conStart
        
            EndStart[0].c.data.conStart.forEach((e)=>{
                //e.c.removeConnected({c:EndStart[0].c,f:e.f})
                //e.c.removeConnected({c:EndStart[1].c,f:e.f})
                
                //e.c.removeConnected({c:EndStart[1],f:"start"})
                //e.c.removeConnected({c:EndStart[1],f:"end"})
                //e.c.removeConnected({c:EndStart[0],f:"start"})
                //e.c.removeConnected({c:EndStart[0],f:"end"})
                

                console.log("HOHOHOHOHOHOHOHO")
                console.log(pathTD.id);
                //e.c.removeConnected({c:pathTD,f:"start"});
                //e.c.removeConnected({c:pathTD,f:"end"});

            })

        }else{
            AJbegin="end"
            //inner is start and outer is end
            console.log("CON END on A is OUTER");
            Ainner = A.data.conStart

            Aouter = EndStart[0].c.data.conEnd//EndStart[0].c.data.conEnd


            EndStart[0].c.data.conEnd.forEach((e)=>{
                //e.c.removeConnected({c:EndStart[0].c,f:e.f})
                //e.c.removeConnected({c:EndStart[1].c,f:e.f})
                
                //e.c.removeConnected({c:EndStart[1],f:"start"})
                //e.c.removeConnected({c:EndStart[1],f:"end"})
                //e.c.removeConnected({c:EndStart[0],f:"start"})
                //e.c.removeConnected({c:EndStart[0],f:"end"})

                console.log("HOHOHOHOHOHOHOHO")
                console.log(pathTD.id);
                //e.c.removeConnected({c:pathTD,f:"start"});
                //e.c.removeConnected({c:pathTD,f:"end"});

            })

        }
        let B = EndStart[1]
        console.log(EndStart);
        let Binner
        let Bouter

        if(EndStart[0].f == "start"){
            
        }

        
        if(EndStart[1].f == "start"){
            BJend="end"
            //inner is start and outer is end
            console.log("CON END on B is OUTER");

            Bouter = EndStart[1].c.data.conEnd

            EndStart[1].c.data.conEnd.forEach((e)=>{
                e.c.strokeColor = "blue"
                
                //e.c.removeConnected({c:EndStart[1].c,f:"start"})
                //e.c.removeConnected({c:EndStart[1].c,f:"end"})
                //e.c.removeConnected({c:EndStart[0].c,f:"start"})
                //e.c.removeConnected({c:EndStart[0].c,f:"end"})
                //e.c.removeConnected({c:EndStart[0],f:e.f})
                console.log("HOHOHOHOHOHOHOHO")
                console.log(pathTD.id);
                //e.c.removeConnected({c:pathTD,f:"start"});
                //e.c.removeConnected({c:pathTD,f:"end"});

            })

            
        }else if(EndStart[1].f == "end"){
            BJend="start"
            //outer is start and inner is end
            console.log("CON START on B is OUTER");

            Bouter = EndStart[1].c.data.conStart

            EndStart[1].c.data.conStart.forEach((e)=>{
                e.c.strokeColor = "blue"

                //e.c.removeConnected({c:EndStart[1].c,f:"start"})
                //e.c.removeConnected({c:EndStart[1].c,f:"end"})
                //e.c.removeConnected({c:EndStart[0].c,f:"start"})
                //e.c.removeConnected({c:EndStart[0].c,f:"end"})
                //e.c.removeConnected({c:EndStart[0],f:e.f})

                console.log("HOHOHOHOHOHOHOHO")
                console.log(pathTD.id);
                //e.c.removeConnected({c:pathTD,f:"start"});
                //e.c.removeConnected({c:pathTD,f:"end"});

            })
            
        }
        //gets rewritten
        //EndStart[0].c.removeConnected({c:EndStart[1].c,f:EndStart[1].f})
        
        /*if(B.data.conEnd.some(e => e.c.id == pathTD.id)){
            console.log("TWOA");
            Binner = B.data.conEnd
            Bouter = B.data.conStart
            //B.data.conStart.forEach((e)=>{
                let r = pathTD.removeConnected(B)
                let resp = B.data.conStart[0].removeConnected(B)
                console.log(EndStart.slice());

                console.log(resp);
                if (resp == "end"){
                    B.data.conStart[0].addConnectedEnd(A,"end")
                    console.log("A");
                }
                if (resp == "start"){
                    B.data.conStart[0].addConnectedStart(A,"end")
                    console.log("B");

                }
            //})
            console.log(EndStart.slice());
        
        }else{
            console.log("TWOB");
            Binner = B.data.conStart
            Bouter = B.data.conEnd
            B.data.conEnd.forEach((e)=>{
                let resp
                if(e.f == "start"){
                    resp = e.c.removeConnectedStart(B)
                }else if(e.f == "end"){
                    resp = e.c.removeConnectedEnd(B)

                }
                if (resp == "end"){
                    e.c.addConnectedEnd(A,"start")
                    console.log("A1");
                }
                if (resp == "start"){
                    e.c.addConnectedStart(A,"start")
                    console.log("B1");
                }
            })
        }*/

        /*cPath.data.conEnd.forEach((e)=>{
            
            e.c.removeConnected({c:cPath,f:e.f})
            
        })*/

        //EndStart[1] = Binner
        console.log(EndStart.slice());
        /*Bouter.forEach((e)=>{
            e.c.strokeColor = "blue"

            e.c.removeConnected({c:EndStart[1],f:"start"})
            e.c.removeConnected({c:EndStart[1],f:"end"})
            e.c.removeConnected({c:EndStart[0],f:"start"})
            e.c.removeConnected({c:EndStart[0],f:"end"})
            //e.c.removeConnected({c:EndStart[0],f:e.f})
            e.c.removeConnected({c:pathTD,f:"start"});
            e.c.removeConnected({c:pathTD,f:"end"});

        })*/
        EndStart[1].c.removeConnected({c:pathTD,f:"end"})
        EndStart[1].c.removeConnected({c:pathTD,f:"start"})
        /*Aouter.forEach((e)=>{
            e.c.removeConnected({c:EndStart[0],f:e.f})
            e.c.removeConnected({c:EndStart[1],f:e.f})
            
            e.c.removeConnected({c:EndStart[1],f:"start"})
            e.c.removeConnected({c:EndStart[1],f:"end"})
            e.c.removeConnected({c:EndStart[0],f:"start"})
            e.c.removeConnected({c:EndStart[0],f:"end"})

            e.c.removeConnected({c:pathTD,f:"start"});
            e.c.removeConnected({c:pathTD,f:"end"});

        })*/
        EndStart[0].c.removeConnected({c:pathTD,f:"end"})
        EndStart[0].c.removeConnected({c:pathTD,f:"start"})
        //EndStart[0].c.join(EndStart[1].c)
        //EndStart[0].c.data.conStart = Aouter
        //EndStart[0].c.data.conEnd = Bouter
        //EndStart[0].c.removeConnected({c:pathTD,f:"start"});
        //EndStart[0].c.removeConnected({c:pathTD,f:"end"});

        //start of first line is its end or start
        //let AJbegin
        //end of second line is its end or start
        //let BJend

        let joinedPathSegments
        if(AJbegin=="start"){
            if(BJend=="start"){
                joinedPathSegments = EndStart[0].c.segments.concat(EndStart[1].c.segments.reverse())
            }else if(BJend=="end"){
                joinedPathSegments = EndStart[0].c.segments.concat(EndStart[1].c.segments)
            }
        }else if(AJbegin=="end"){
            if(BJend=="start"){
                joinedPathSegments = EndStart[0].c.segments.reverse().concat(EndStart[1].c.segments.reverse())
            }else if(BJend=="end"){
                joinedPathSegments = EndStart[0].c.segments.reverse().concat(EndStart[1].c.segments)
            }
        }
        //joinedPathSegments = EndStart[0].segments.concat(EndStart[1].segments)
        jPath = createPath(undefined,joinedPathSegments)
        jPath.data.conStart = Aouter;
        jPath.data.conStartMeta = AJbegin;
        jPath.data.conEnd = Bouter;
        jPath.data.conEndMeta = BJend;

        jPath.data.conStart[0].c.strokeColor = "red"
        //jPath.data.conEnd[0].c.strokeColor = "red"
        console.log("HEREHEREHERE");
        console.log(EndStart[0].c);
        console.log(EndStart[1].c);
        EndStart[0].c.remove()
        EndStart[1].c.remove()
        //A.data.conStart = Aouter
        //A.data.conEnd = Binner
    }else{
        pathTD.data.conEnd.forEach((e)=>{
            e.c.removeConnected({c:pathTD,f:e.f})
            //e.c.removeConnected(pathTD)

        })
    }
}