import pandas


def convertCSV(path,sep=",",encoding='utf8') -> list[str]:
    csv = pandas.read_csv(path,sep=sep,encoding=encoding).fillna("None")
    ret = []
    try:
        for item in csv.loc:
            txt = ""
            for i,it in enumerate(list(csv)):
                txt += it +" : "+str(list(item)[i]) +"\n"
            ret.append(txt)
    finally :
        return ret