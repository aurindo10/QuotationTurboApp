import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { RouterOutputs } from "../../utils/trpc";
import building from "../../../public/building.png";
// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#E4E4E4",
    paddingBottom: 32,
  },
  header: {
    margin: 10,
    paddingTop: 16,
    flexGrow: 1,
  },
  textHeader: {
    fontSize: 18,
  },
});

export type OneBuyList = RouterOutputs["buyList"]["getBuyListByCotation"];
interface Props {
  products: OneBuyList[0]["buyList"];
  orgName?: string;
  userName?: string;
  createdAt: string;
  sellerName?: string;
  empresaName?: string;
  urlOrgLogo?: string;
}

export const MyDocument = ({
  products,
  orgName,
  sellerName,
  userName,
  createdAt,
  empresaName,
  urlOrgLogo,
}: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{ width: "100%", alignItems: "center", paddingTop: "16px" }}
        >
          <Text style={{}}>Lista de Compra</Text>
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            marginTop: "53px",
          }}
        >
          {/* <Image
            // src={urlOrgLogo!.length > 6 ? urlOrgLogo : building}
            src={imageBuffer}
            style={{
              width: "100",
              height: "100",
              marginLeft: "32px",
              color: "black",
              objectFit: "cover",
            }}
          ></Image> */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "100%",
              gap: "8px",
              marginLeft: "32px",
            }}
          >
            <Text style={{ marginLeft: "" }}>{orgName}</Text>
            <Text style={{ marginLeft: "" }}>Autor: {userName}</Text>
            <Text style={{ marginLeft: "" }}>Data:{createdAt} </Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginTop: "16px",
            gap: "4px",
            marginLeft: "32px",
          }}
        >
          <Text style={{}}>Vendedor: {sellerName}</Text>
          <Text style={{}}>Empresa: {empresaName}</Text>
        </View>
        <View
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "16px",
              marginLeft: "32px",
            }}
          >
            <Text
              style={{
                width: "160px",
                backgroundColor: "#54565E",
                color: "white",
                paddingTop: "4px",
                paddingBottom: "4px",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              Nome
            </Text>
            <Text
              style={{
                width: "80px",
                backgroundColor: "#54565E",
                color: "white",
                paddingTop: "4px",
                paddingBottom: "4px",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              Quantidade
            </Text>
            <Text
              style={{
                width: "80px",
                backgroundColor: "#54565E",
                color: "white",
                paddingTop: "4px",
                paddingBottom: "4px",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              Marca
            </Text>
            <Text
              style={{
                width: "80px",
                backgroundColor: "#54565E",
                color: "white",
                paddingTop: "4px",
                paddingBottom: "4px",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              Código
            </Text>
            <Text
              style={{
                width: "120px",
                backgroundColor: "#54565E",
                color: "white",
                paddingTop: "4px",
                paddingBottom: "4px",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              Valor (R$)
            </Text>
          </View>
          {products.map((product) => {
            function formatarParaReal(numero: number): string {
              return numero.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
            }
            return (
              <View
                key={product.produtoCotado.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: "32px",
                }}
              >
                <Text
                  style={{
                    width: "160px",
                    backgroundColor: "#BAB5B5",
                    color: "black",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  {product.produtoCotado.produtoDaCotacao.produto.nome}
                </Text>
                <Text
                  style={{
                    width: "80px",
                    backgroundColor: "#BAB5B5",
                    color: "black",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  {product.produtoCotado.produtoDaCotacao.quantidade}
                </Text>
                <Text
                  style={{
                    width: "80px",
                    backgroundColor: "#BAB5B5",
                    color: "black",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  Tramontina
                </Text>
                <Text
                  style={{
                    width: "80px",
                    backgroundColor: "#BAB5B5",
                    color: "black",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  {product.produtoCotado.produtoDaCotacao.produto.code}
                </Text>
                <Text
                  style={{
                    width: "120px",
                    backgroundColor: "#BAB5B5",
                    color: "black",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  {formatarParaReal(product.produtoCotado.valor ?? 0)}
                </Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};
