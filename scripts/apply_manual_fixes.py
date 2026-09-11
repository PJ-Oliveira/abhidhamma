import json

fixes = {
    "visuddhimagga/mula__2.json": {
        20: "Mas entrar no primeiro jhāna no kasiṇa de terra, e então entrar nos outros jhānas restantes naquele mesmo kasiṇa de terra, é chamado de transposição dos fatores."
    },
    "visuddhimagga/mula__3.json": {
        1484: "751. Mas o conhecimento do aparecimento como terror tem medo ou não tem medo? Ele não tem medo. Pois é apenas o discernimento de que 'as formações passadas cessaram, as presentes estão cessando, as futuras cessarão'. Portanto, assim como um homem de boa visão, olhando para três fossos de brasas ardentes no portão da cidade, não tem medo por si mesmo, mas apenas discerne: 'Quem quer que caia aqui não experimentará pouco sofrimento'; ou assim como um homem de boa visão, olhando para três estacas fincadas em fileira — uma estaca de madeira de acácia, uma estaca de ferro e uma estaca de ouro —, não tem medo por si mesmo, mas apenas discerne: 'Quem quer que caia sobre estas estacas não experimentará pouco sofrimento'; da mesma forma, o conhecimento do aparecimento como terror não tem medo de si mesmo, mas apenas discerne, em relação aos três planos de existência que se assemelham aos três fossos de brasas e às três estacas, que 'as formações passadas cessaram, as presentes estão cessando, as futuras cessarão'. No entanto, porque todas as formações em todos os planos de existência, modos de geração, destinos, estações de consciência e moradas dos seres aparecem para ele como arruinadas e perigosas, apresentando-se sob o aspecto de medo, é chamado de 'aparecimento como terror'."
    },
    "visuddhimagga/tika__1.json": {
        16: "Mas assim como não se pode dizer que a expressão 'em todos os kasiṇas' inclui também os kasiṇas de espaço e consciência, visto que aqui apenas os oito kasiṇas são alcançados, da mesma forma não se pode dizer que cada jhāna imaterial é 'um único jhāna', porque o treinamento da mente por meio das oito realizações é desejado. Portanto, deve-se entender que a transição de fatores e objetos por meio dos jhānas imateriais foi descrita de maneira figurada. Pois, referindo-se à esfera da consciência infinita que tem como objeto a primeira consciência imaterial no espaço revelado pela remoção do kasiṇa amarelo, foi dito: 'tendo entrado na esfera da consciência infinita a partir do kasiṇa amarelo'. Por esse método, o significado nos outros dois casos restantes também deve ser compreendido. Na expressão 'ekantarikavasena' (por meio de alternância), a palavra 'antara' tem o significado de 'outro'. A própria palavra 'antara' é 'antarika'; aquilo em que há uma alternância conjunta é 'ekantarika' (alternado), referindo-se à entrada no jhāna; 'por meio disso' significa por meio dessa alternância. O significado é: por meio da entrada no jhāna de tal forma que há uma distinção diferente em conjunto para os fatores e para o objeto. E esta distinção ocorre por meio da superação daqueles fatores e objetos inferiores; portanto, foi dito 'a transição de fatores e objetos por meio de alternância'. Quando os fatores são definidos por frases como 'este jhāna tem cinco fatores', e os objetos por frases como 'este é o kasiṇa de terra', não há benefício especial em defini-los em conjunto; portanto, este método não foi apresentado nos comentários. E, ao fazê-lo, embora o salto de jhānas, etc., seja obtido na ordem inversa, na ordem direta e inversa, e por meio de alternância, tal salto de jhānas, etc., não foi extraído em detalhes; e como o treinamento da mente é realizado mesmo sem esses métodos, deve-se considerar que eles não foram incluídos nos comentários para evitar prolixidade."
    }
}

for filepath, id_map in fixes.items():
    with open(f"data/works/{filepath}", "r") as f:
        data = json.load(f)
    for seg in data:
        if seg["id"] in id_map:
            seg["pt"] = id_map[seg["id"]]
    with open(f"data/works/{filepath}", "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Manual fixes applied!")
