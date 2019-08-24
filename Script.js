
/*
	-L'interface observable ou sujet doit avoir une collection d'observers, addObserver, removeObserver, notifyObserver	
	-une collection doit avoir des methode basique pour add, remove, count...etc								
	-L'interface observer doit avoir une methode pour update()
	So:				
*/

//1- Give basic operations to my observerCollection. Comme on va créer une liste avec +ieurs opérations, il faudrait créer une classe

//Class wich build and give operations of collection observers
function ObserverListBuilder()
{
	this.observerCollection = []; 
}

ObserverListBuilder.prototype.Add = function(item)
{
	this.observerCollection.push(item);
}

ObserverListBuilder.prototype.Remove = function(item)
{
	this.observerCollection.splice(item, 1);
}


ObserverListBuilder.prototype.GetObj = function(indice)
{
	return this.observerCollection[indice];
}
 
ObserverListBuilder.prototype.IndexOf = function(item)
{
	this.observerCollection.forEach(function(elet, indice){
		if(elet == item)
		{
			return indice;
		}
		return -1;
	})
}

ObserverListBuilder.prototype.Count = function()
{
	return this.observerCollection.length;
}
//End class 


//interface Sujet (mon observable)
function ISubject()
{
	this.myTrackers = new ObserverListBuilder();
}

ISubject.prototype.AddObserver = function(observerToAdd)
{
	this.myTrackers.Add(observerToAdd);
}

ISubject.prototype.RemoveObserver = function(observerToRemove)
{
	this.myTrackers.Remove(observerToRemove);
}

ISubject.prototype.NotifyMyTrackers = function(newTemperature)
{			
	for(var i=0; i < this.myTrackers.Count(); i++)
	{
		this.myTrackers.GetObj(i).Update(newTemperature);
	}
}
//Fin interface Sujet


//Interface IObserver
function IObserver()
{
	
}

IObserver.prototype.Update = function(newTemperature)
{
	//sera implémentée de plusieurs manières donc à implémenter dans les classes concrètes
}	

IObserver.prototype.HotOrCold = function(temperature)
{
	switch (temperature)
	{
		case temperature > 0:	
			this.className = "hot";
			
		case temperature < 0:
			this.className = "cold"; 
	}
}
//fin interface IObserver


function FaireHeriter(objet, concreteClassToCreate)
{
	//objet = concreteClassToCreate; ça n'a pas marché, il faut boucler sur les prop de la classe conscrete et les transferer à objet
	for (var indice in concreteClassToCreate) {
		objet[indice] = concreteClassToCreate[indice]; // objet[indice] --> crée prop a l'indice courrant
		
	}
}

var operationsPattern = (function(){
	var myObjet = {};

	myObjet.activerPattern = function(){

		FaireHeriter(observable, new ISubject());
		FaireHeriter(observer1, new IObserver());
		FaireHeriter(observer2, new IObserver());
		FaireHeriter(observer3, new IObserver());
		
		observable.addEventListener('keyup', function(){
			this.NotifyMyTrackers(this.value);
		}, false)
		
		observer1.Update = function(newTemperature)
		{
			var temp = newTemperature + " °C";
			this.innerHTML = temp;
			this.HotOrCold(+newTemperature);
		}
		
		observer2.Update = function(newTemperature)
		{
			var temp = +newTemperature + 273.15 + " K";
			this.innerHTML = temp;
			this.HotOrCold(+newTemperature);
		}
		
		observer3.Update = function(newTemperature)
		{
			var temp = (+newTemperature * (9/5)) + 32 + " °F";
			this.innerHTML = temp;
			this.HotOrCold(+newTemperature);
		}
		
		observable.AddObserver(observer1);
		observable.AddObserver(observer2);
		observable.AddObserver(observer3);

		
		document.getElementById("activateButton").disabled = true;
		document.getElementById("desactivateButton").disabled = false;
	}
	
	myObjet.desactiverPattern = function()
	{
		observable.RemoveObserver(observer1);
		observable.RemoveObserver(observer2);
		observable.RemoveObserver(observer3);

		
		document.getElementById("activateButton").disabled = false;
		document.getElementById("desactivateButton").disabled = true;
	}

	return myObjet;
})();

