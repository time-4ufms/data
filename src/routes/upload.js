// routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const db = require('../database');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv({ separator: '\t' })) // <-- ajuste aqui
        .on('data', (data) => {
            const cleanedRow = {};
            for (const key in data) {
                cleanedRow[key.trim()] = data[key];
            }
            console.log("Colunas detectadas:", Object.keys(cleanedRow));
            results.push(cleanedRow);
        })
        .on('end',async () => {
            for (const row of results) {
                const values = [
                    row['data_base'], row['uf'], row['codmun'], row['municipio'], row['cnpj'],
                    row['nome_instituicao'], row['agencia'], row['verbete_110_disponibilidades'],
                    row['verbete_111_caixa'], row['verbete_112_depositos_bancarios'],
                    row['verbete_113_bacen_reserv_banc_em_especie'],
                    row['verbete_120_aplic_interfinanc_de_liquidez'],
                    row['verbete_130_tit_e_val_mob_e_inst_fin_deriv'],
                    row['verbete_140_rel_interfinanc_e_interdepend'],
                    row['verbete_141_142_correspondentes'],
                    row['verbete_144_145_cobranca_ordens_pagamento'],
                    row['verbete_146_147_dependencias'],
                    row['verbete_152_suprimentos_interdependencias'],
                    row['verbete_158_outr_rel_interf_e_interdepend'],
                    row['verbete_160_operacoes_de_credito'], row['verbete_161_empres_e_tit_descontados'],
                    row['verbete_162_financiamentos'], row['verbete_163_fin_rurais_agricul'],
                    row['verbete_167_financiamentos_agroindustriais'],
                    row['verbete_169_financiamentos_imobiliarios'],
                    row['verbete_171_outras_operacoes_de_credito'],
                    row['verbete_172_outros_creditos'],
                    row['verbete_174_prov_oper_creditos'],
                    row['verbete_176_operacoes_especiais'],
                    row['verbete_180_arrendamento_mercantil'],
                    row['verbete_184_prov_oper_arr_mercantil'],
                    row['verbete_190_outros_valores_e_bens'],
                    row['verbete_200_permanente'],
                    row['verbete_399_total_do_ativo'],
                    row['verbete_401_419_depositos_agrupados'],
                    row['verbete_420_depositos_de_poupanca'],
                    row['verbete_430_depositos_interifnanceiros'],
                    row['verbete_431_depositos_interfinanceiros'],
                    row['verbete_432_depositos_a_prazo'],
                    row['verbete_433_captacoes_no_mercado_aberto'],
                    row['verbete_440_rel_interfinanc_e_interdepend'],
                    row['verbete_441_442_correspondentes'],
                    row['verbete_444_447_transito_dependencias'],
                    row['verbete_460_obrig_por_emp_e_repasses'],
                    row['verbete_461_468_obrig_assist_especiais'],
                    row['verbete_470_inst_financeiros_derivativos'],
                    row['verbete_480_obrigacoes_por_recebimento'],
                    row['verbete_481_487_tributos_contrib'],
                    row['verbete_490_500_outras_obrigacoes'],
                    row['verbete_610_patrimonio_liquido'],
                    row['verbete_710_contas_de_resultado'],
                    row['verbete_711_contas_credoras'],
                    row['verbete_712_contas_devedoras'],
                    row['verbete_899_total_do_passivo'],
                    row['codmun_ibge']
                ];

                const placeholders = values.map(() => '?').join(', ');
                const sql = `
                    INSERT INTO estban (
                        data_base, uf, codmun, municipio, cnpj, nome_instituicao, agencia,
                        verbete_110_disponibilidades, verbete_111_caixa, verbete_112_depositos_bancarios,
                        verbete_113_bacen_reserv_banc_em_especie, verbete_120_aplic_interfinanc_de_liquidez,
                        verbete_130_tit_e_val_mob_e_inst_fin_deriv, verbete_140_rel_interfinanc_e_interdepend,
                        verbete_141_142_correspondentes, verbete_144_145_cobranca_ordens_pagamento,
                        verbete_146_147_dependencias, verbete_152_suprimentos_interdependencias,
                        verbete_158_outr_rel_interf_e_interdepend, verbete_160_operacoes_de_credito,
                        verbete_161_empres_e_tit_descontados, verbete_162_financiamentos,
                        verbete_163_fin_rurais_agricul, verbete_167_financiamentos_agroindustriais,
                        verbete_169_financiamentos_imobiliarios, verbete_171_outras_operacoes_de_credito,
                        verbete_172_outros_creditos, verbete_174_prov_oper_creditos,
                        verbete_176_operacoes_especiais, verbete_180_arrendamento_mercantil,
                        verbete_184_prov_oper_arr_mercantil, verbete_190_outros_valores_e_bens,
                        verbete_200_permanente, verbete_399_total_do_ativo,
                        verbete_401_419_depositos_agrupados, verbete_420_depositos_de_poupanca,
                        verbete_430_depositos_interifnanceiros, verbete_431_depositos_interfinanceiros,
                        verbete_432_depositos_a_prazo, verbete_433_captacoes_no_mercado_aberto,
                        verbete_440_rel_interfinanc_e_interdepend, verbete_441_442_correspondentes,
                        verbete_444_447_transito_dependencias, verbete_460_obrig_por_emp_e_repasses,
                        verbete_461_468_obrig_assist_especiais, verbete_470_inst_financeiros_derivativos,
                        verbete_480_obrigacoes_por_recebimento, verbete_481_487_tributos_contrib,
                        verbete_490_500_outras_obrigacoes, verbete_610_patrimonio_liquido,
                        verbete_710_contas_de_resultado, verbete_711_contas_credoras,
                        verbete_712_contas_devedoras, verbete_899_total_do_passivo, codmun_ibge
                    ) VALUES (${placeholders})
                `;

                db.query(sql, values, (err) => {
                    if (err) {
                        console.error("Erro ao inserir linha:", err.message);
                    }
                });
            }

            res.send("Importação concluída com sucesso!");
        });
});

module.exports = router;
